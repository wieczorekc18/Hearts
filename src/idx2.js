
let playerScore = 0;
let comp0Score = 0;
let comp1Score = 0;
let comp2Score = 0;


// turn event listener functions into named functions
// entering pick lead? likely could be solved by solving above


const gameboard = document.querySelector(".gameboard")
const score = document.querySelector(".scoreboard")
const start = document.querySelector(".new-game-button")
const rules = document.querySelector(".rules-button")
const rulesText = document.querySelector(".rules-text")
rules.addEventListener("click", () => {
    rulesText.classList.toggle("show-rules")
})
start.addEventListener("click", () => {
    gameboard.innerHTML = ""
    let game = new Game
    gameboard.append(game.game)
    // for(let i=0; i < 200; i++){
    game.playRound()
    // }
})

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.cardLi = document.createElement("LI")
        this.cardLi.classList.add("card")
    }

    hide() {
        this.cardLi.classList.remove("shown-card")

        this.cardLi.classList.add("hidden-card")
        this.cardLi.innerHTML = ""
    }

    show() {

        this.cardLi.classList.remove("hidden-card")
        if (this.rank === 14) {
            this.cardLi.append("A")
        } else if (this.rank === 13) {
            this.cardLi.append("K")
        } else if (this.rank === 12) {
            this.cardLi.append("Q")
        } else if (this.rank === 11) {
            this.cardLi.append("J")
        } else {
            this.cardLi.append(this.rank)
        }
        if (this.suit === "Clubs") {
            this.cardLi.append(" ♣")
        } else if (this.suit === "Diamonds") {
            this.cardLi.append(" ♦")
            this.cardLi.classList.add("red-card")
        } else if (this.suit === "Hearts") {
            this.cardLi.append(" ♥")
            this.cardLi.classList.add("red-card")
        } else if (this.suit === "Spades") {
            this.cardLi.append(" ♠")
        }
        this.cardLi.classList.add("shown-card")
    }
}

class Deck {
    constructor() {
        this.cards = []
        const suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        this.populate = this.populate.bind(this)
        this.shuffle = this.shuffle.bind(this)
        this.populate(suits, ranks)
        this.shuffle()
        this.deal = this.deal.bind(this)
    }

    populate(suits, ranks) {
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                let card = new Card(suits[i], ranks[j])
                this.cards.push(card)
            }
        }
    }

    //fisher/yates shuffle

    shuffle() {
        let i, j, temp;
        for (i = this.cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    deal() {
        let hand = this.cards.slice(0, 13)
        this.cards = this.cards.slice(13)
        return hand
    }

}



class Game {
    constructor() {
        this.game = document.createElement("DIV")
        this.game.classList.add("hands")
        this.roundCounter = 0
        this.winner
        this.ended = false
        this.starter
        this.playRound = this.playRound.bind(this)
        // this.passedAlready = false
        this.firstTrick = true
        this.heartsBroken = false
        this.round0 = this.round0.bind(this)
        this.round1 = this.round1.bind(this)
        this.round2 = this.round2.bind(this)
        this.round3 = this.round3.bind(this)
        this.thePlay = this.thePlay.bind(this)
        this.players = []
    }

    playRound() {
        const that = this
        that.players = []
        while (that.game.firstChild) {
            that.game.removeChild(that.game.firstChild)
        }
        let deck = new Deck
        that.player = new PlayerHand(deck)
        that.comp0 = new ComputerHand(deck, 0)
        that.comp1 = new ComputerHand(deck, 1)
        that.comp2 = new ComputerHand(deck, 2)
        that.game.append(that.comp0.compHand)
        that.game.append(that.comp1.compHand)
        that.game.append(that.comp2.compHand)
        that.game.append(that.player.playerHand)
        that.player.show()
        that.comp0.show()
        that.comp1.show()
        that.comp2.show()
        that.players = [that.player, that.comp0, that.comp1, that.comp2]
        if (that.roundCounter === 0) {
            let passMessage = document.createElement("DIV")
            gameboard.append(passMessage)
            passMessage.append("Select 3 cards to pass to the left")
            passMessage.classList.add("message")
            that.player.selectThree(that.comp0)
                .then(() => {
                    that.round0()
                    gameboard.removeChild(passMessage)
                    that.thePlay()
                        .then(() => {
                            setTimeout(() => that.thePlay().then(() => {
                                setTimeout(() => that.thePlay().then(() => {
                                    setTimeout(() => that.thePlay().then(() => {
                                        setTimeout(() => that.thePlay().then(() => {
                                            setTimeout(() => that.thePlay().then(() => {
                                                setTimeout(() => that.thePlay().then(() => {
                                                    setTimeout(() => that.thePlay().then(() => {
                                                        setTimeout(() => that.thePlay().then(() => {
                                                            setTimeout(() => that.thePlay().then(() => {
                                                                setTimeout(() => that.thePlay().then(() => {
                                                                    setTimeout(() => that.thePlay().then(() => {
                                                                        setTimeout(() => that.thePlay(), 3000)
                                                                    }), 3000)
                                                                }), 3000)
                                                            }), 3000)
                                                        }), 3000)
                                                    }), 3000)
                                                }), 3000)
                                            }), 3000)
                                        }), 3000)
                                    }), 3000)
                                }), 3000)
                            }), 3000)
                        })
                })
        } else if (that.roundCounter === 1) {
            let passMessage = document.createElement("DIV")
            gameboard.append(passMessage)
            passMessage.append("Select 3 cards to pass to the right")
            passMessage.classList.add("pass-message")
            that.player.selectThree(that.comp2).then(() => that.round1())
        } else if (that.roundCounter === 2) {
            let passMessage = document.createElement("DIV")
            gameboard.append(passMessage)
            passMessage.append("Select 3 cards to pass to the player accross from you")
            passMessage.classList.add("pass-message")
            that.player.selectThree(that.comp1).then(() => that.round2())
        } else {
            that.roundCounter = 0
        }
    }

    thePlay() {
        const that = this
        return new Promise((resolve, reject) => {
            let idx
            let trick
            let allCards = []
            that.players.forEach(player => {
                allCards = allCards.concat(player.cards)
            })
            if (allCards.length > 0) {
                if (that.firstTrick) {
                    that.players.forEach(player => {
                        if (player.hasTwoOfClubs()) {
                            that.starter = player
                        }
                    })
                    idx = that.players.indexOf(that.starter)
                    that.players[idx].pickLead(that).then((res) => {
                        trick = new Trick(res)
                        that.winner = that.players[idx]
                        idx = ((idx + 1) % 4)

                        // that.players[idx].playOne(trick)
                        setTimeout(() => that.players[idx].playOne(trick)
                            .then(() => {
                                if (trick.changeHighest()) {
                                    that.winner = that.players[idx]
                                }
                                idx = ((idx + 1) % 4)
                                setTimeout(() => that.players[idx].playOne(trick)
                                    .then(() => {
                                        if (trick.changeHighest()) {
                                            that.winner = that.players[idx]
                                        }
                                        idx = ((idx + 1) % 4)
                                        setTimeout(() => {
                                            that.players[idx].playOne(trick).then(() => {
                                                if (trick.changeHighest()) {
                                                    that.winner = that.players[idx]
                                                }
                                                trick.logScore(that.winner)
                                                resolve("success")
                                            })
                                            that.firstTrick = false
                                        }, 2000)
                                    })
                                    , 2000)
                            }), 2000)
                    })
                } else {
                    idx = that.players.indexOf(that.winner)
                    that.players[idx].pickLead(that).then((res) => {
                        trick = new Trick(res)
                        that.winner = that.players[idx]
                        idx = ((idx + 1) % 4)
                        setTimeout(() => that.players[idx].playOne(trick)
                            .then(() => {
                                if (trick.changeHighest()) {
                                    that.winner = that.players[idx]
                                }
                                idx = ((idx + 1) % 4)
                                setTimeout(() => that.players[idx].playOne(trick)
                                    .then(() => {
                                        if (trick.changeHighest()) {
                                            that.winner = that.players[idx]
                                        }
                                        idx = ((idx + 1) % 4)
                                        setTimeout(() => {
                                            that.players[idx].playOne(trick).then(() => {
                                                if (trick.changeHighest()) {
                                                    that.winner = that.players[idx]
                                                }
                                                trick.logScore(that.winner)
                                                resolve("success")
                                            })
                                        }, 2000)
                                    })
                                    , 2000)
                            }), 2000)
                    })
                }
            }
            if (allCards.length === 0) {
                trick.displayScore()
                that.ended = true
                resolve("success")
            }
        })
    }

    round0() {
        const that = this
        that.comp0.selectThree(that.comp1)
        that.comp1.selectThree(that.comp2)
        that.comp2.selectThree(that.player)
        that.player.show()
        that.comp0.show()
        that.comp1.show()
        that.comp2.show()
        that.roundCounter += 1
    }

    round1() {
        const that = this
        that.comp2.selectThree(that.comp1)
        that.comp1.selectThree(that.comp0)
        that.comp0.selectThree(that.player)
        that.player.show()
        that.comp0.show()
        that.comp1.show()
        that.comp2.show()
        that.roundCounter += 1
    }

    round2() {
        const that = this
        that.comp2.selectThree(that.comp0)
        that.comp0.selectThree(that.comp2)
        that.comp1.selectThree(that.player)
        that.player.show()
        that.comp0.show()
        that.comp1.show()
        that.comp2.show()
        that.roundCounter += 1
    }

    round3() {
        const that = this
        that.roundCounter = 0
    }
}

class ComputerHand {
    constructor(deck, num) {
        this.cards = deck.deal();
        this.num = num
        this.compHand = document.createElement("UL")
        let className = "comp-player-" + this.num
        this.compHand.classList.add(className)
        this.show = this.show.bind(this)
        this.selectThree = this.selectThree.bind(this)
        this.passThree = this.passThree.bind(this)
        this.playOne = this.playOne.bind(this)
        this.pickLead = this.pickLead.bind(this)
        this.hasTwoOfClubs = this.hasTwoOfClubs.bind(this)
    }

    hasTwoOfClubs() {
        const that = this
        let ans = false
        that.cards.forEach(card => {
            if (card.suit === "Clubs" && card.rank === 2) {
                ans = true
            }
        })
        return ans
    }

    show() {
        const that = this
        while (that.compHand.firstChild) {
            that.compHand.removeChild(that.compHand.firstChild)
        }
        that.cards = that.cards.map(card => {
            card.hide()
            that.compHand.append(card.cardLi)
            if (that.num % 2 === 0) {
                card.cardLi.classList.add("rot")
            }
            return card
        })
    }

    selectThree(player) {
        const that = this
        let unwanted = that.cards.slice(0, 3)
        that.cards = that.cards.slice(3)
        that.passThree(unwanted)
        player.acceptThree(unwanted)
    }

    passThree(unwanted) {
        unwanted = unwanted.map(card => {
            if (card.cardLi.parentElement) {
                this.compHand.removeChild(card.cardLi)
            }
            return card
        })
        return unwanted
    }
    acceptThree(passedCards) {
        const that = this
        passedCards = passedCards.map(card => {
            that.compHand.append(card.cardLi)
            card.cardLi.classList.toggle("rot")
            return card
        })
        that.cards = that.cards.concat(passedCards)
    }

    pickLead(game) {
        let starter
        const that = this
        return new Promise((resolve, reject) => {
            if (game.firstTrick) {
                that.cards.forEach(card => {
                    if (card.suit === "Clubs" && card.rank === 2) {
                        starter = card
                    }
                })
            } else if (game.heartsBroken) {
                starter = that.cards.slice(0, 1)
            } else {
                that.cards.forEach(card => {
                    if (card.suit !== "Hearts") {
                        starter = card
                    }
                })
                if (!starter) {
                    starter = that.cards.slice(0, 1)
                }
            }
            let idx = that.cards.indexOf(starter)
            let left = that.cards.slice(0, idx)
            let right = that.cards.slice(idx + 1)
            that.cards = left.concat(right)
            let theCard = starter
            let identifier = "player" + (that.num + 1)
            theCard.cardLi.classList.add(identifier)
            resolve(theCard)
        })
    }

    playOne(trick) {
        const that = this
        return new Promise((resolve, reject) => {


            let choice
            //if trick.pile[0] is 2 clubs
            let playable = that.cards.filter(card => {
                if (trick.suit !== "Hearts") {
                    if (card.suit === trick.suit) {
                        return card
                    }
                } else {
                    if (card.rank > trick.rank && card.suit === "Hearts") {
                        return card
                    }
                }
            })
            if (trick.suit === "Clubs" && trick.pile[0].rank === 2) {
                playable = playable.map(card => {
                    if (card.suit !== "Hearts") {
                        if (card.rank === 12 && card.suit === "Spades") {

                        } else {
                            return card
                        }
                    }
                })
            }
            if (playable.length > 0) {
                choice = playable[0]
            } else if (trick.suit === "Hearts") {
                let hearts = that.cards.filter(card => card.suit === trick.suit)
                if (hearts.first) {
                    choice = hearts.first
                } else {
                    choice = that.cards.first
                }
            } else {
                choice = that.cards[0]
            }
            let idx = that.cards.indexOf(choice)
            let left = that.cards.slice(0, idx)
            let right = that.cards.slice(idx + 1)
            that.cards = left.concat(right)
            let identifier = "player" + (that.num + 1)
            choice.cardLi.classList.add(identifier)
            trick.accept(choice)
            resolve("success")
        })
    }
}


class PlayerHand {
    constructor(deck) {
        this.cards = deck.deal();
        this.playerHand = document.createElement("UL")
        this.playerHand.classList.add("player-hand")
        this.show = this.show.bind(this)
        this.selectThree = this.selectThree.bind(this)
        this.order = this.order.bind(this)
        this.hasTwoOfClubs = this.hasTwoOfClubs.bind(this)
        this.pickLead = this.pickLead.bind(this)
        this.playOne = this.playOne.bind(this)
    }

    hasTwoOfClubs() {
        const that = this
        let ans = false
        that.cards.forEach(card => {
            if (card.suit === "Clubs" && card.rank === 2) {
                ans = true
            }
        })
        return ans
    }

    show() {
        const that = this
        that.cards = that.order()
        while (that.playerHand.firstChild) {
            that.playerHand.removeChild(that.playerHand.firstChild)
        }
        that.cards = that.cards.map(card => {
            card.show()
            that.playerHand.append(card.cardLi)
            return card
        })

    }

    pickLead(game) {
        const that = this
        let choice
        return new Promise((resolve, reject) => {
            if (game.firstTrick && that.hasTwoOfClubs()) {
                let twoClubsMessage = document.createElement("DIV")
                gameboard.append(twoClubsMessage)
                twoClubsMessage.append("You have the 2 of Clubs Begin the Round by playing it")
                twoClubsMessage.classList.add("message")
                choice = that.cards[0]
                const clickHandler = () => {
                    if (choice.cardLi.parentElement) {
                        choice.cardLi.parentElement.removeChild(choice.cardLi)
                    }
                    that.cards = that.cards.slice(1)
                    if (twoClubsMessage.parentElement) {
                        gameboard.removeChild(twoClubsMessage)
                    }
                    let theCard = choice
                    theCard.cardLi.classList.add("player0")
                    resolve(theCard)
                }
                choice.cardLi.addEventListener("click", clickHandler)

            } else if (game.heartsBroken) {
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                that.cards.forEach(card => {
                    let clickHandler = () => {
                        choice = card
                        if (pickLeadMessage.parentElement) {
                            gameboard.removeChild(pickLeadMessage)
                        }
                        if (choice.cardLi.parentElement) {
                            choice.cardLi.parentElement.removeChild(choice.cardLi)
                        }
                        let idx = that.cards.indexOf(choice)
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        that.cards = that.cards.map(card => {
                            card.cardLi.removeEventListener("click", clickHandler)
                            return card
                        })
                        let theCard = choice
                        theCard.cardLi.classList.add("player0")
                        resolve(theCard)
                    }
                    card.cardLi.addEventListener("click", clickHandler)
                })
            } else {
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                let options = that.cards.filter(card => card.suit !== "Hearts")
                if (options.length > 0) {
                    that.cards.forEach(card => {
                        if (card.suit !== "Hearts") {
                            let clickHandler = () => {
                                choice = card
                                if (choice.cardLi.parentElement) {
                                    choice.cardLi.parentElement.removeChild(choice.cardLi)
                                }
                                if (pickLeadMessage.parentElement) {
                                    gameboard.removeChild(pickLeadMessage)
                                }
                                let idx = that.cards.indexOf(choice)
                                let left = that.cards.slice(0, idx)
                                let right = that.cards.slice(idx + 1)
                                that.cards = left.concat(right)
                                let theCard = choice
                                that.cards = that.cards.map(card => {
                                    card.cardLi.removeEventListener("click", clickHandler)
                                    return card
                                })
                                theCard.cardLi.classList.add("player0")
                                resolve(theCard)
                            }
                            card.cardLi.addEventListener("click", clickHandler)
                        }

                    })
                } else {
                    that.cards.forEach(card => {
                        let clickHandler = () => {
                            choice = card
                            if (choice.cardLi.parentElement) {
                                choice.cardLi.parentElement.removeChild(choice.cardLi)
                            }
                            if (pickLeadMessage.parentElement) {
                                gameboard.removeChild(pickLeadMessage)
                            }
                            let idx = that.cards.indexOf(choice)
                            let left = that.cards.slice(0, idx)
                            let right = that.cards.slice(idx + 1)
                            that.cards = left.concat(right)
                            let theCard = choice
                            that.cards = that.cards.map(card => {
                                card.cardLi.removeEventListener("click", clickHandler)
                                return card
                            })
                            theCard.cardLi.classList.add("player0")
                            resolve(theCard)
                        }
                        card.cardLi.addEventListener("click", clickHandler)
                    })
                }
            }
        })
    }

    playOne(trick) {
        //if trick.pile[0] is 2 clubs
        const that = this
        let options
        let choice
        // debugger
        return new Promise((resolve, reject) => {
            let playOneMessage = document.createElement("DIV")
            gameboard.append(playOneMessage)
            playOneMessage.classList.add("play-one-message")
            if (trick.suit === "Hearts") {
                playOneMessage.append("Your turn remember you must go up in hearts if you can")
                trick.pile
                options = that.cards.filter(card => card.suit === "Hearts" && card.rank > highest)
                if (options.length === 0) {
                    options = that.cards.filter(card => card.suit === trick.suit)
                }
            } else {
                playOneMessage.append("Your turn")
                // debugger
                options = that.cards.filter(card => card.suit === trick.suit)
            }
            // debugger
            if (options.length === 0) {
                options = that.cards
            }
            if (trick.suit === "Clubs" && trick.pile[0].rank === 2) {
                options = options.map(card => {
                    if (card.suit !== "Hearts") {
                        if (card.rank === 12 && card.suit === "Spades") {

                        } else {
                            return card
                        }
                    }
                })
            }
            if (options.length === 0) {
                options = that.cards
            }
            // debugger
            options.forEach(card => {
                let clickHandler = () => {
                    choice = card
                    // debugger
                    if (choice.cardLi.parentElement) {
                        if (choice.cardLi.parentElement.classList.contains("player-hand")) {
                            choice.cardLi.parentElement.removeChild(choice.cardLi)
                        }
                    }
                    if (playOneMessage.parentElement) {
                        gameboard.removeChild(playOneMessage)
                    }
                    let idx = that.cards.indexOf(choice)
                    // debugger
                    if (idx > -1 && typeof (idx) === "number") {
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        that.cards = that.cards.map(card => {
                            card.cardLi.removeEventListener("click", clickHandler)
                            return card
                        })
                        choice.cardLi.classList.add("player0")
                        // debugger
                        trick.accept(choice)
                        // debugger
                    }
                    resolve("success")
                    // debugger
                }
                card.cardLi.addEventListener("click", clickHandler)
            })
        })
    }

    selectThree(player) {
        const that = this
        return new Promise((resolve, reject) => {
            let unwanted = []
            let passBtn = document.createElement("BUTTON")
            that.cards = that.cards.map(card => {
                let passHandler = () => {
                    unwanted.length < 3 ? card.cardLi.classList.toggle("select") : card.cardLi.classList.remove("select")
                    if (card.cardLi.classList.contains("select")) {
                        unwanted.push(card)
                    } else if (unwanted.includes(card)) {
                        let i = unwanted.indexOf(card)
                        let left = unwanted.slice(0, i)
                        let right = unwanted.slice(i + 1)
                        unwanted = left.concat(right)
                    }

                    if (unwanted.length === 3) {
                        passBtn.classList.remove("hide-button")
                        // passBtn = document.createElement("BUTTON")
                        gameboard.append(passBtn)
                        passBtn.innerHTML = "";
                        passBtn.append("PASS")
                        let passBtnHandler = () => {
                            unwanted.forEach(card => {
                                card.cardLi.classList.remove("select")
                            })
                            that.passThree(unwanted)
                            player.acceptThree(unwanted)
                            passBtn.classList.add("hide-button")
                            resolve("success")
                        }
                        passBtn.addEventListener("click", passBtnHandler)
                    } else {
                        passBtn.classList.add("hide-button")
                    }
                }
                card.cardLi.addEventListener("click", passHandler)
                return card
            })
        })
    }

    passThree(unwanted) {
        const that = this

        unwanted = unwanted.map(card => {
            card.hide()
            // that.playerHand.removeChild(card.cardLi) //??????
            let i = that.cards.indexOf(card)
            let left = that.cards.slice(0, i)
            let right = that.cards.slice(i + 1)
            that.cards = left.concat(right)
            return card;
        })
        // return unwanted
    }
    acceptThree(passedCards) {
        const that = this
        passedCards = passedCards.map(card => {
            that.playerHand.append(card.cardLi)
            if (card.cardLi.classList.contains("rot")) {
                card.cardLi.classList.toggle("rot")
            }
            card.show()
            return card
        })
        that.cards = that.cards.concat(passedCards)
    }

    order() {
        const that = this
        let clubs = that.cards.filter(card => card.suit === "Clubs")
        let diamonds = that.cards.filter(card => card.suit === "Diamonds")
        let hearts = that.cards.filter(card => card.suit === "Hearts")
        let spades = that.cards.filter(card => card.suit === "Spades")
        let clubRanks = clubs.map(card => {
            return card.rank
        })
        clubRanks.sort((a, b) => a - b)
        clubs = [];
        clubRanks.forEach(club => (
            clubs.push(new Card("Clubs", club))
        ))
        let diamondRanks = diamonds.map(card => {
            return card.rank
        })
        diamondRanks.sort((a, b) => a - b)
        diamonds = [];
        diamondRanks.forEach(diamond => (
            diamonds.push(new Card("Diamonds", diamond))
        ))
        let heartRanks = hearts.map(card => {
            return card.rank
        })
        heartRanks.sort((a, b) => a - b)
        hearts = [];
        heartRanks.forEach(heart => (
            hearts.push(new Card("Hearts", heart))
        ))
        let spadeRanks = spades.map(card => {
            return card.rank
        })
        spadeRanks.sort((a, b) => a - b)
        spades = [];
        spadeRanks.forEach(spade => (
            spades.push(new Card("Spades", spade))
        ))
        that.cards = clubs.concat(diamonds.concat(spades.concat(hearts)))
        return that.cards
    }

}

class Trick {
    constructor(leadCard) {
        let dup = leadCard
        this.suit = dup.suit
        this.highest = dup.rank
        this.pile = [dup];
        if (dup.rank === 12 && dup.suit === "Spades") {
            this.value = -13;
        } else if (dup.suit === "Hearts") {
            this.value = -1
        } else if (dup.rank === 11 && dup.suit === "Diamonds") {
            this.value = 10
        } else {
            this.value = 0;
        }
        this.accept = this.accept.bind(this)
        this.show = this.show.bind(this)
        this.getVal = this.getVal.bind(this)
        this.logScore = this.logScore.bind(this)
        this.show()
    }

    clear() {
        const that = this
        debugger
        let clearTrick = document.querySelector(".trick")
        if (clearTrick) {
            gameboard.removeChild(clearTrick)
        }
        that.pile = [];
        debugger
    }

    show() {
        const that = this
        let clearTrick = document.querySelector(".trick")
        if (clearTrick) {
            gameboard.removeChild(clearTrick)
        }
        let newTrick = document.createElement("DIV")

        gameboard.append(newTrick)
        // that.pile = that.pile.map(card => {

        //     return
        // })
        that.pile.forEach(card => {
            card.hide()
            card.show()
            newTrick.append(card.cardLi)
        })
        newTrick.classList.add("trick")
        if (that.pile.length > 3) {
            setTimeout(() => that.clear(), 2000)
        }
    }

    accept(card) {
        const that = this
        debugger
        let dup = card
        that.pile.push(dup)
        that.show()
    }

    changeHighest() {
        const that = this
        if (that.pile[that.pile.length - 1].rank > that.highest && that.pile[that.pile.length - 1].suit === that.suit) {
            that.highest = that.pile[that.pile.length - 1].rank;
            return true;
        }
        return false;
    }

    changeValue(card) {
        if (card.rank === 12 && card.suit === "Spades") {
            this.value -= 13;
        } else if (card.suit === "Hearts") {
            this.value -= 1
        } else if (card.rank === 11 && card.suit === "Diamonds") {
            this.value += 10
        } else {
            this.value;
        }
    }

    getVal() {
        return this.value
    }

    logScore(winner) {
        const that = this
        if (winner.name == "PlayerHand") {
            playerScore += that.getVal();
        } else {
            if (winner.num === 0) {
                comp0Score += that.getVal();
            } else if (winner.num === 1) {
                comp1Score += that.getVal();
            } else {
                comp2Score += that.getVal();
            }
        }
    }

    displayScore() {
        gameboard.append(scoreboard)

        scoreboard.append()
    }

}