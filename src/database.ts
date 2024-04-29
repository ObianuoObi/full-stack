import { Pool } from "pg"
import { User } from "./server"

const pool = new Pool({
	user: "obi",
	host: "localhost",
	database: "obi",
	password: "",
	port: 5432,
})

export const getUsers = async () => {
	try {
		const result = await pool.query(
			"SELECT id, username, balance, referral_link, email, full_name FROM user_details;"
		)
		return result.rows
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUser = async (userId: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE id = $1",
			[userId]
		)
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUserByUsername = async (username: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE username = $1",
			[username]
		)
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const updateUserBalance = async (userId: string, newBalance: number) => {
	try {
		await pool.query("UPDATE user_details SET balance = $1 WHERE id = $2", [
			newBalance,
			userId,
		])
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createTransaction = async (userId: string, amount: number) => {
	try {
		await pool.query(
			"INSERT INTO investments(user_id, amount) VALUES($1, $2)",
			[userId, amount]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createWithdrawal = async (userId: string, amount: number) => {
	try {
		await pool.query(
			"INSERT INTO withdrawals(user_id, amount) VALUES($1, $2)",
			[userId, amount]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createReferral = async (userId: string, referralId: string) => {
	try {
		await pool.query(
			"INSERT INTO referrals(referrer_id, referred_id) VALUES($1, $2)",
			[userId, referralId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createPairing = async (userId: string, adminId: string) => {
	try {
		await pool.query(
			"INSERT INTO pairings(payer_id, payee_id) VALUES($1, $2)",
			[userId, adminId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const saveUserToDatabase = async (user: User) => {
	try {
		await pool.query(
			"INSERT INTO user_details(username, email, password) VALUES($1, $2, $3)",
			[user.username, user.email, user.password]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}
