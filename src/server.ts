import dotenv from "dotenv"
import express, {
	Request as ExpressRequest,
	Response,
	NextFunction,
} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getUsers, saveUserToDatabase, getUserByUsername } from "./database" // Import getUsers function
import { invest, withdraw, pairUsers } from "./businessLogic"
import Joi from "joi"
import https from "https"
import fs from "fs"
import rateLimit from "express-rate-limit"

dotenv.config()

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

const options = {
	key: fs.readFileSync("path/to/private-key.pem"), // REVISIT
	cert: fs.readFileSync("path/to/public-certificate.pem"), // REVISIT
}

https.createServer(options, app).listen(3000, () => {
	console.log("HTTPS server running on port 3000")
})

export interface User {
	username: string
	email: string
	password: string
	isAdmin: boolean
}

interface Request extends ExpressRequest {
	user?: string | JwtPayload
}

let users: User[] = []

const userSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
	isAdmin: Joi.boolean(),
})

app.post("/register", async (req: Request, res: Response) => {
	const { error } = userSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 12)
		const user: User = {
			username: req.body.username,
			email: req.body.email,
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
			username: req.body.username,
			email: req.body.email,
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
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
})

app.post("/login", async (req: Request, res: Response) => {
	const { error } = loginSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const user = await getUserByUsername(req.body.username)

	if (user == null) {
		return res.status(400).send("Invalid username or password")
	}

	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			const accessToken = jwt.sign(
				{ username: user.username, authMethod: "login" },
				process.env.ACCESS_TOKEN_SECRET!
			)
			res.json({ accessToken: accessToken })
		} else {
			res.send("Invalid username or password")
		}
	} catch (error) {
		console.error(error) // Log the error for your own debugging
		res.status(500).send({ message: "Error logging in" })
	}
})

app.post("/refresh-token", async (req: Request, res: Response) => {
	// Assume refreshToken is sent as a Bearer token in the Authorization header
	const authHeader = req.headers["authorization"]
	const refreshToken = authHeader && authHeader.split(" ")[1]

	if (!refreshToken) {
		return res.sendStatus(401) // Unauthorized
	}

	// Verify the refresh token
	let userData
	try {
		userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
	} catch (err) {
		return res.sendStatus(403) // Forbidden
	}

	if (
		typeof userData === "string" ||
		!req.user ||
		typeof req.user === "string"
	) {
		return res.sendStatus(401) // Unauthorized
	}

	// Generate a new access token
	const accessToken = jwt.sign(
		{ username: userData.username, authMethod: "refreshToken" },
		process.env.ACCESS_TOKEN_SECRET!
	)

	res.json({ accessToken: accessToken })
})

function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if (token == null) return res.sendStatus(401)

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
}

app.post(
	"/sensitive-operation",
	authenticateToken,
	async (req: Request, res: Response) => {
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send("Unauthorized")
		}

		if ((req.user as JwtPayload).authMethod === "refreshToken") {
			return res
				.status(401)
				.send("Please log in again to perform this operation")
		}

		// Perform the sensitive operation
		// This is just a placeholder. Replace with your actual operation.
		res.send("Sensitive operation performed successfully")
	}
)
const investSchema = Joi.object({
	amount: Joi.number().positive().required(),
})

app.post("/invest", authenticateToken, async (req: Request, res: Response) => {
	const { error } = investSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	try {
		if (!req.user || typeof req.user === "string") {
			return res.status(401).send("Unauthorized")
		}

		const newBalance = await invest(req.user.id, req.body.amount)
		res.json({ newBalance: newBalance })
	} catch (error) {
		console.error(error)
		res.status(500).send("An error occurred while making an investment.")
	}
})

const withdrawSchema = Joi.object({
	amount: Joi.number().positive().required(),
})

app.post(
	"/withdraw",
	authenticateToken,
	async (req: Request, res: Response) => {
		const { error } = withdrawSchema.validate(req.body)
		if (error) return res.status(400).send(error.details[0].message)

		try {
			// Check if the user is authenticated
			if (!req.user || typeof req.user === "string") {
				return res.status(401).send("Unauthorized")
			}

			const newBalance = await withdraw(req.user.id, req.body.amount)
			res.json({ newBalance: newBalance })
		} catch (error) {
			console.error(error)
			res.status(500).send("An error occurred while requesting a withdrawal.")
		}
	}
)

const pairSchema = Joi.object({
	userId: Joi.string().required(),
	payerIds: Joi.array().items(Joi.string()).required(),
})

app.post("/pair", authenticateToken, async (req: Request, res: Response) => {
	const { error } = pairSchema.validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	// Check if the user is authenticated and is an admin
	if (!req.user || typeof req.user === "string" || !req.user.isAdmin) {
		return res.status(403).send("Forbidden")
	}

	try {
		await pairUsers(req.body.userId, req.body.payerIds)
		res.send("Pairing successful")
	} catch (error) {
		console.error(error)
		res.status(500).send("An error occurred while pairing users.")
	}
})

app.listen(3000, () => {
	console.log(`Server is running on http://localhost:3000`)
})
