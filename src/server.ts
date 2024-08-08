import dotenv from "dotenv"
import express, {
	Request as ExpressRequest,
	Response,
	NextFunction,
} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {
	getUsers,
	saveUserToDatabase,
	getUserByPhoneNumber,
	updateUserDetails,
	depositMoney,
	withdrawMoney,
} from "./database"
import { invest, withdraw, pairUsers } from "./businessLogic"
import Joi from "joi"
import https from "https"
import fs from "fs"
import rateLimit from "express-rate-limit"
import cors from "cors"

dotenv.config()

function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]

	if (token == null) return res.sendStatus(401) // if there isn't any token

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string,
		(err: any, user: any) => {
			if (err) return res.sendStatus(403)
			req.user = user
			next() // pass the execution off to whatever request the client intended
		}
	)
}

if (!process.env.ACCESS_TOKEN_SECRET) {
	console.error(
		"ACCESS_TOKEN_SECRET is not defined. Check your .env file or environment variables."
	)
	process.exit(1)
}

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
})

const app = express()
app.use(express.json())
app.use(limiter)
app.use(cors())

const options = {
	key: fs.readFileSync("certs/private-key.pem"), // REVISIT
	cert: fs.readFileSync("certs/public-certificate.pem"), // REVISIT
}

https.createServer(options, app).listen(3001, () => {
	console.log("HTTPS server running on port 3001")
})

export interface User {
	first_name: string
	last_name: string
	phone_number: string
	password: string
	isAdmin: boolean
}

interface Request extends ExpressRequest {
	user?: string | JwtPayload
}

let users: User[] = []

const userSchema = Joi.object({
	first_name: Joi.string().min(3).max(30).required(),
	last_name: Joi.string().min(3).max(30).required(),
	phone_number: Joi.string().required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
	confirm_password: Joi.ref("password"),
})

app.post("/register", async (req: Request, res: Response) => {
	const { error } = userSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 12)
		const user: User = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			phone_number: req.body.phone_number,
			password: hashedPassword,
			isAdmin: false, // new users are not admins by default
		}
		// save the user to the database
		await saveUserToDatabase(user)
		res.status(201).send() // send a 201 Created response
	} catch (error) {
		console.error(error) // Log the error for your own debugging
		res.status(500).send({ message: "Error registering user" })
	}
})

app.get("/users", authenticateToken, async (req: Request, res: Response) => {
	try {
		const users = await getUsers()
		res.json(users)
	} catch (error) {
		console.error(error) // Log the error for your own debugging
		res.status(500).send({ message: "Error fetching users" })
	}
})

app.post("/users", async (req: Request, res: Response) => {
	const { error } = userSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const user: User = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			phone_number: req.body.phone_number,
			password: hashedPassword,
			isAdmin: false,
		}
		// save the user to the database
		await saveUserToDatabase(user)
		res.status(201).send() // send a 201 Created response
	} catch (error) {
		console.error(error) // Log the error for your own debugging
		res.status(500).send({ message: "Error creating user" })
	}
})

const loginSchema = Joi.object({
	phone_number: Joi.string().required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
})

app.post("/login", async (req: Request, res: Response) => {
	console.log("Received login request with data:", req.body) // Log the request data

	const { error } = loginSchema.validate(req.body)
	if (error) {
		console.error(error.details)
		return res.status(400).send(error.details[0].message)
	}

	console.log("Phone number from request:", req.body.phone_number) // Log the phone number from the request

	const user = await getUserByPhoneNumber(req.body.phone_number)

	console.log("User from database:", user) // Log the user from the database

	if (user == null) {
		return res.status(400).send("Invalid phone number or password")
	}

	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			const accessToken = jwt.sign(
				{ phone_number: user.phone_number, authMethod: "login" },
				process.env.ACCESS_TOKEN_SECRET!
			)
			res.json({ accessToken: accessToken })
		} else {
			res.send("Invalid phone number or password")
		}
	} catch (error) {
		console.error(error) // Log the error for your own debugging
		res.status(500).send({ message: "Error logging in" })
	}
})

app.post(
	"/updateAccountDetails",
	authenticateToken,
	async (req: Request, res: Response) => {
		const { first_name, last_name, account_number } = req.body
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send({ message: "Unauthorized" })
		}
		try {
			await updateUserDetails(
				req.user.phone_number, // userId
				{ first_name, last_name, account_number } // details
			)
			res.status(200).send()
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: "Error updating account details" })
		}
	}
)

app.post("/deposit", authenticateToken, async (req: Request, res: Response) => {
	const { deposit } = req.body
	if (!req.user || typeof req.user === "string") {
		return res.status(401).send({ message: "Unauthorized" })
	}
	try {
		await depositMoney(deposit, req.user.phone_number)
		res.status(200).send()
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: "Error depositing money" })
	}
})

app.post(
	"/withdraw",
	authenticateToken,
	async (req: Request, res: Response) => {
		const { withdraw } = req.body
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send({ message: "Unauthorized" })
		}
		try {
			await withdrawMoney(withdraw, req.user.phone_number)
			res.status(200).send()
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: "Error withdrawing money" })
		}
	}
)

// Endpoint to get user details
app.get(
	"/getUserDetails",
	authenticateToken,
	async (req: Request, res: Response) => {
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send({ message: "Unauthorized" })
		}
		try {
			const user = await getUserByPhoneNumber(req.user.phone_number)
			res.json(user)
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: "Error getting user details" })
		}
	}
)

// Endpoint to update user details
app.post(
	"/updateAccountDetails",
	authenticateToken,
	async (req: Request, res: Response) => {
		const { first_name, last_name, account_number } = req.body
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send({ message: "Unauthorized" })
		}
		try {
			await updateUserDetails(
				req.user.phone_number, // userId
				{ first_name, last_name, account_number } // details
			)
			res.status(200).send()
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: "Error updating account details" })
		}
	}
)

app.listen(3002, () => {
	console.log(`Server is running on http://localhost:3002`)
})
app.use(
	cors({
		origin: "http://localhost:3000",
	})
)
