class Work {
  #balance = 0

  getBalance = () => this.#balance

  work = () => {
    this.#balance += 100
  }

  deductBalance = (amount) => {
    this.#balance -= amount
  }
}

class Bank {
  #balance = 0
  #loan = 0

  getBalance = () => this.#balance

  /**
   * Repays an outstanding loan up to 10% automatically if present.
   */
  deposit = (amount) => {
    if (this.hasOutStandingLoan()) {
      const payBackAmount = this.#calculatePaybackAmount(amount)
      this.#loan -= payBackAmount
      this.#addToBalance(amount - payBackAmount)
      return
    }

    this.#addToBalance(amount)
  }

  hasOutStandingLoan = () => this.#loan != 0
  getOutstandingLoan = () => this.#loan

  /**
   * Loan amount will be added to balance if granted.
   * @returns boolean, whether the loan was granted.
   */
  requestLoan = (loanAmount) => {
    loanAmount = parseFloat(loanAmount)
    if (isNaN(loanAmount)) {
      return false
    }
    if (this.#loan > 0) {
      return false
    }
    if (loanAmount > this.#balance * 2) {
      return false
    }

    this.#addToBalance(loanAmount)
    this.#loan = loanAmount
    return true
  }

  repayLoan = (amount) => {
    const leftOverAmount = amount - this.#loan
    if (leftOverAmount > 0) {
      this.#loan = 0
      this.#addToBalance(leftOverAmount)
      return
    }

    // Repay amount less than current loan, no balance updt
    this.#loan -= amount
  }

  deductBalance = (amount) => {
    this.#balance -= amount
  }

  #calculatePaybackAmount = (fromAmount) => {
    const max = fromAmount * 0.1
    if (max > this.#loan) {
      return this.#loan
    }
    return max
  }

  #addToBalance = (amount) => {
    this.#balance += amount
  }
}

class ShopAPI {
  static async getData() {
    try {
      const result = await fetch(this.baseUrl() + "/computers")
      const data = await result.json()
      return data
    } catch (e) {
      console.error("Failed to fetch: ", e)
      return []
    }
  }

  static baseUrl() {
    return "https://hickory-quilled-actress.glitch.me"
  }
}

/**
 * Handles money traffic
 */
class TransactionFacilitator {
  static bankDeposit = (workObject, bankObject) => {
    const amount = workObject.getBalance()
    workObject.deductBalance(amount)
    bankObject.deposit(amount)
  }

  static bankLoanPayment = (workObject, bankObject) => {
    const amount = workObject.getBalance()
    workObject.deductBalance(amount)
    bankObject.repayLoan(amount)
  }

  /**
   * "Purchases" a product, returns true if successfully completed.
   */
  static purchaseProduct = (bankObject, productPrice) => {
    const price = parseFloat(productPrice)
    const balance = bankObject.getBalance()

    if (productPrice > balance) {
      return false
    }

    bankObject.deductBalance(price)
    return true
  }
}
