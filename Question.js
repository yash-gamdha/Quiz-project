class Question {
    constructor(question, answer, options) {
        this.question = question;
        this.answer = answer;
        this.options = this.getOptions(options, this.answer)
        this.isCorrect = false
    }

    getOptions(options, answer) {
        options.push(answer)

        for (let i = options.length - 1;i > 0;i--) {
            const j = Math.floor(Math.random() * (i + 1))

            const temp = options[i]
            options[i] = options[j]
            options[j] = temp
        }

        return options
    }
}

export default Question