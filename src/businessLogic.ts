import {
	getUser,
	updateUserBalance,
	createTransaction,
	createWithdrawal,
	createReferral,
	createPairing,
} from "./database"

export const invest = async (userId: string, amount: number) => {
	// Validate input
	if (amount <= 0) {
		throw new Error("Investment amount must be greater than 0")
	}

	// Get user
	const user = await getUser(userId)
	if (!user) {
		throw new Error("User not found")
	}

	// Check user's balance
	if (user.balance < amount) {
		throw new Error("Insufficient balance")
	}

	// Update user's balance
	const newBalance = user.balance - amount
	await updateUserBalance(userId, newBalance)

	// Record transaction
	await createTransaction(userId, amount)

	return newBalance
}

export const withdraw = async (userId: string, amount: number) => {
	// Validate input
	if (amount <= 0) {
		throw new Error("Withdrawal amount must be greater than 0")
	}

	// Get user
	const user = await getUser(userId)
	if (!user) {
		throw new Error("User not found")
	}

	// Check user's balance
	if (user.balance < amount) {
		throw new Error("Insufficient balance")
	}

	// Update user's balance
	const newBalance = user.balance - amount
	await updateUserBalance(userId, newBalance)

	// Record withdrawal
	await createWithdrawal(userId, amount)

	return newBalance
}

export const refer = async (userId: string, referralId: string) => {
	// Get user
	const user = await getUser(userId)
	if (!user) {
		throw new Error("User not found")
	}

	// Get referral
	const referral = await getUser(referralId)
	if (!referral) {
		throw new Error("Referral not found")
	}

	// Record referral
	await createReferral(userId, referralId)

	// Give bonus to user
	const bonus = 10 // Or whatever your bonus amount is
	const newBalance = user.balance + bonus
	await updateUserBalance(userId, newBalance)

	return newBalance
}

export const pairUsers = async (userId: string, payerIds: string[]) => {
	// Get user
	const user = await getUser(userId)
	if (!user) {
		throw new Error("User not found")
	}

	// Pair each payer with user
	for (const payerId of payerIds) {
		// Get payer
		const payer = await getUser(payerId)
		if (!payer) {
			throw new Error(`Payer with id ${payerId} not found`)
		}

		// Pair payer with user
		await createPairing(userId, payerId)
	}

	return true
}
