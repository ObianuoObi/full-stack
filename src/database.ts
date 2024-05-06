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
			"SELECT id, first_name, last_name, balance, referral_link, phone_number, FROM user_details;"
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
export const getUserByPhoneNumber = async (phone_number: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE phone_number = $1",
			[phone_number]
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
			"INSERT INTO user_details(first_name, last_name, phone_number, password) VALUES($1, $2, $3, $4)",
			[user.first_name, user.last_name, user.phone_number, user.password]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const updateUserDetails = async (
	first_name: string,
	last_name: string,
	account_number: string,
	phone_number: string
) => {
	await pool.query(
		"UPDATE user_details SET first_name = $1, last_name = $2, account_number = $3 WHERE phone_number = $4",
		[first_name, last_name, account_number, phone_number]
	)
}

export const depositMoney = async (deposit: number, phone_number: string) => {
	await pool.query(
		"UPDATE user_details SET balance = balance + $1 WHERE phone_number = $2",
		[deposit, phone_number]
	)
}

export const withdrawMoney = async (withdraw: number, phone_number: string) => {
	await pool.query(
		"UPDATE user_details SET balance = balance - $1 WHERE phone_number = $2",
		[withdraw, phone_number]
	)
}
