
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
const rulesX = document.querySelector(".rules-x")
const scoreButton = document.querySelector(".score-button")

const scoreX = document.querySelector(".score-x")

scoreButton.addEventListener("click", ()=>{
    score.classList.toggle("hide-score")
})

scoreX.addEventListener("click", ()=>{
    score.classList.toggle("hide-score")
})

rulesX.addEventListener("click", ()=>{

    rulesText.classList.toggle("show-rules")
})

rules.addEventListener("click", () => {
    rulesText.classList.toggle("show-rules")
})
start.addEventListener("click", () => {
    score.classList.add("hide-score")
    gameboard.innerHTML = ""
    let game = new Game
    gameboard.append(game.game)
    // for(let i=0; i < 200; i++){
    game.playRound()
        .then(() => {
            setTimeout(() => score.classList.add("hide-score"), 5000)
            game.playRound()
                .then(() => {
                    setTimeout(() => score.classList.add("hide-score"), 5000)
                    game.playRound()
                        .then(() => {
                            setTimeout(() => score.classList.add("hide-score"), 5000)
                            game.playRound()
                                .then(() => {
                                    setTimeout(() => score.classList.add("hide-score"), 5000)
                                    game.playRound()
                                })
                        })
                })
        })
})


//Add event listeners only once to all cards 

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.cardLi = document.createElement("LI")
        this.cardLi.classList.add("card")
        this.addListen = this.addListen.bind(this)
        this.useCard = this.useCard.bind(this)
        this.validCard = false
        // turn valid card false again when clicked
        // periodically invalidate all player's cards
        this.passingCard = false 
        this.addListen()
        this.callback
        //
    }

    addListen(){
        const that = this
        that.cardLi.addEventListener("click", that.useCard)
    }

    useCard(){
        const that = this 
        if(that.validCard){
            if (that.cardLi.parentElement) {
                if (that.cardLi.parentElement.classList.contains("player-hand")) {
                    that.cardLi.parentElement.removeChild(that.cardLi)
                    that.cardLi.classList.add("player0")
                    let message = document.querySelector(".message")
                    let playMessage = document.querySelector(".play-one-message")
                    if(message){
                        message.parentElement.removeChild(message)
                    }
                    if (playMessage) {
                        playMessage.parentElement.removeChild(playMessage)
                    }
                    that.callback()
                }
            }
        }else if(that.passingCard){
            that.cardLi.classList.toggle("select")
            that.callback()
        }
    }
    //while(notPassed){
    //     if(unwanted.length < 3){
            // queryselectorall(".select") returns nodelist
            // or do if(queryselctall.length????)
    // }else{
        // add passbtn and addeventlistenter(click, () => player.invalidateALL && notPassed = false)
    // }
    // }

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

class Game{
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
        this.displayScore = this.displayScore.bind(this)
        this.thePlay = this.thePlay.bind(this)
        this.players = []
        this.rounds = this.rounds.bind(this)
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

    displayScore() {
        let playerUl = document.querySelector(".player-score")
        let comp0Ul = document.querySelector(".comp0-score")
        let comp1Ul = document.querySelector(".comp1-score")
        let comp2Ul = document.querySelector(".comp2-score")
        let playerScoreLi = document.createElement("LI")
        let comp0ScoreLi = document.createElement("LI")
        let comp1ScoreLi = document.createElement("LI")
        let comp2ScoreLi = document.createElement("LI")
        playerScoreLi.append(playerScore)
        comp0ScoreLi.append(comp0Score)
        comp1ScoreLi.append(comp1Score)
        comp2ScoreLi.append(comp2Score)
        playerUl.append(playerScoreLi)
        comp0Ul.append(comp0ScoreLi)
        comp1Ul.append(comp1ScoreLi)
        comp2Ul.append(comp2ScoreLi)
        score.classList.remove("hide-score")
    }

    rounds(){
        const that = this
        return new Promise((resolve, reject) => {
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
                                                        setTimeout(() => that.thePlay().then(() => {
                                                            setTimeout(() => {
                                                                resolve("success")
                                                                that.displayScore()
                                                            }, 3000)
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
            }), 3000)
        })
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
        return new Promise((resolve, reject) => {
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
                                that.rounds().then(() => resolve("success"))
                            })
                    })
            } else if (that.roundCounter === 1) {
                let passMessage = document.createElement("DIV")
                gameboard.append(passMessage)
                passMessage.append("Select 3 cards to pass to the right")
                passMessage.classList.add("message")
                that.player.selectThree(that.comp2)
                    .then(() => {
                        that.round1()
                        gameboard.removeChild(passMessage)
                        that.thePlay()
                            .then(() => {
                                that.rounds().then(() => resolve("success"))
                            })
                    })
            } else if (that.roundCounter === 2) {
                let passMessage = document.createElement("DIV")
                gameboard.append(passMessage)
                passMessage.append("Select 3 cards to pass to the player accross from you")
                passMessage.classList.add("message")
                
                that.player.selectThree(that.comp1)
                    .then(() => {
                        that.round2()
                        gameboard.removeChild(passMessage)
                        that.thePlay()
                            .then(() => {
                                that.rounds().then(() => resolve("success"))
                            })
                    })
            } else {
                // let passMessage = document.createElement("DIV")
                // gameboard.append(passMessage)
                // passMessage.append("No passing this round Hold your cards")
                // passMessage.classList.add("pass-message")
                that.round3()
                // gameboard.removeChild(passMessage)
                that.thePlay()
                    .then(() => {
                        that.rounds()
                    })
            }
        })
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
            if(allCards.length === 52){
                that.firstTrick = true
            }
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
                        if(res.suit === "Hearts"){
                            that.heartsBroken = true
                        }
                        setTimeout(() => that.players[idx].playOne(trick)
                            .then(() => {
                                if (trick.changeHighest()) {
                                    that.winner = that.players[idx]
                                }
                                if(trick.pile[trick.pile.length -1].suit === "Hearts"){
                                    that.heartsBroken = true
                                }
                                idx = ((idx + 1) % 4)
                                setTimeout(() => that.players[idx].playOne(trick)
                                    .then(() => {
                                        if (trick.changeHighest()) {
                                            that.winner = that.players[idx]
                                        }
                                        if (trick.pile[trick.pile.length - 1].suit === "Hearts") {
                                            that.heartsBroken = true
                                        }
                                        idx = ((idx + 1) % 4)
                                        setTimeout(() => {
                                            that.players[idx].playOne(trick).then(() => {
                                                if (trick.changeHighest()) {
                                                    that.winner = that.players[idx]
                                                }
                                                if (trick.pile[trick.pile.length - 1].suit === "Hearts") {
                                                    that.heartsBroken = true
                                                }
                                                trick.logScore(that.winner)
                                                resolve(trick)
                                            })
                                        }, 2000)
                                    })
                                    , 2000)
                            }), 2000)
                    })
                }
            }
            if (allCards.length === 0) {
                // trick.displayScore()
                that.ended = true
                resolve("success")
            }
            
        })
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
            if(that.cards[5].cardLi.classList.contains("rot")){
                card.cardLi.classList.add("rot")
            }else{
                if (card.cardLi.classList.contains("rot")){
                    card.cardLi.classList.remove("rot")
                }
            }
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
                starter = that.cards.slice(0, 1)[0]
            } else {
                that.cards.forEach(card => {
                    if (card.suit !== "Hearts") {
                        starter = card
                    }
                })
                if (!starter) {
                    starter = that.cards.slice(0, 1)[0]
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
                if (hearts[0]) {
                    choice = hearts[0]
                    hearts.forEach(heart => {
                        if(heart.rank > choice.rank){
                            choice = heart
                        }
                    })
                } else {
                    choice = that.cards[0]
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
        this.num = 15
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

    pickLead(game){
        const that = this
        let choice
        return new Promise((resolve, reject) => {
            if (game.firstTrick && that.hasTwoOfClubs()){
                let twoClubsMessage = document.createElement("DIV")
                gameboard.append(twoClubsMessage)
                twoClubsMessage.append("You have the 2 of Clubs Begin the Round by playing it")
                twoClubsMessage.classList.add("message")
                choice = that.cards[0]
                let cb = () => {
                    if (choice.cardLi.classList.contains("player0")) {
                        let idx = that.cards.indexOf(choice)
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        choice.validCard = false
                        resolve(choice)
                    }
                }
                choice.validCard = true
                choice.callback = cb
                
            }else if(game.heartsBroken){
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                let options = that.cards
                let cb = () => {
                    let choice = options.filter(card => card.cardLi.classList.contains("player0"))
                    if (choice.length === 1) {
                        choice = choice[0]
                        let idx = that.cards.indexOf(choice)
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        options.forEach(card => {
                            card.validCard = false
                        })
                        resolve(choice)
                    }
                }
                options.forEach(card => {
                    card.validCard = true
                    card.callback = cb
                })
            }else{
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                let options = that.cards.filter(card => card.suit !== "Hearts")
                if (options.length === 0) {
                    options = that.cards
                }
                let cb = () => {
                    let choice = options.filter(card => card.cardLi.classList.contains("player0"))
                    if (choice.length === 1) {
                        choice = choice[0]
                        let idx = that.cards.indexOf(choice)
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        options.forEach(card => {
                            card.validCard = false
                        })
                        resolve(choice)
                    }
                }
                options.forEach(card => {
                    card.validCard = true
                    card.callback = cb
                })
            }
        })
    }

    playOne(trick){
        const that = this
        let options
        let choice
        return new Promise((resolve, reject) => {
            let playOneMessage = document.createElement("DIV")
            gameboard.append(playOneMessage)
            playOneMessage.classList.add("play-one-message")
            if (trick.suit === "Hearts") {
                playOneMessage.append("Your turn remember you must go up in hearts if you can")
                trick.pile
                options = that.cards.filter(card => card.suit === "Hearts" && card.rank > trick.highest)
                if (options.length === 0) {
                    options = that.cards.filter(card => card.suit === trick.suit)
                }
            } else {
                playOneMessage.append("Your turn")
                options = that.cards.filter(card => card.suit === trick.suit)
            }
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
                options = options.filter(card => card !== undefined)
            }
            if (options.length === 0) {
                options = that.cards
            }
            let cb = () => {
                let choice = options.filter(card => card.cardLi.classList.contains("player0"))
                if (choice.length === 1) {
                    choice = choice[0]
                    let idx = that.cards.indexOf(choice)
                    let left = that.cards.slice(0, idx)
                    let right = that.cards.slice(idx + 1)
                    that.cards = left.concat(right)
                    options.forEach(card => {
                        card.validCard = false
                    })
                    trick.accept(choice)
                    resolve("success")
                }
            }
            options.forEach(card => {
                card.validCard = true
                card.callback = cb
            })
        })
    }

    selectThree(player) {
        const that = this
        return new Promise((resolve, reject) => {
            let unwanted = []
            let passBtn = document.createElement("BUTTON")
            let cb = () => {
                if (document.querySelectorAll(".select").length === 3) {
                    passBtn.classList.remove("hide-button")
                    gameboard.append(passBtn)
                    passBtn.innerHTML = "";
                    passBtn.append("PASS")
                    passBtn.addEventListener("click", () => {
                        unwanted = that.cards.filter(card => card.cardLi.classList.contains("select"))
                        that.cards.forEach(card => {
                            card.passingCard = false
                        })
                        unwanted.forEach(card => card.cardLi.classList.remove("select"))
                        that.passThree(unwanted)
                        player.acceptThree(unwanted)
                        passBtn.classList.add("hide-button")
                        resolve("success")
                    })
                // } else if (document.querySelectorAll(".select").length > 3){
                //     that.cards.forEach(card => card.cardLi.classList.remove("select"))
                //     unwanted = []
                //     passBtn.classList.add("hide-button")
                // }
                }else {
                    unwanted = []
                    passBtn.classList.add("hide-button")
                }
            }
            that.cards.forEach(card => {
                card.passingCard = true
                card.callback = cb
            })
        })
    }

    passThree(unwanted) {
        const that = this
        unwanted = unwanted.map(card => {
            card.hide()
            let i = that.cards.indexOf(card)
            let left = that.cards.slice(0, i)
            let right = that.cards.slice(i + 1)
            that.cards = left.concat(right)
            return card;
        })
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
        this.changeValue = this.changeValue.bind(this)
        this.show()
    }

    clear() {
        const that = this
        let clearTrick = document.querySelector(".trick")
        if (clearTrick) {
            gameboard.removeChild(clearTrick)
        }
        that.pile = [];
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
        let dup = card
        that.pile.push(dup)
        that.changeValue(dup)
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
        const that = this
        if (card.rank === 12 && card.suit === "Spades") {
            that.value -= 13;
        } else if (card.suit === "Hearts") {
            that.value -= 1
        } else if (card.rank === 11 && card.suit === "Diamonds") {
            that.value += 10
        } else {
            that.value;
        }
    }

    getVal() {
        return this.value
    }

    logScore(winner) {
        const that = this
        if (winner.num === 15) {
            playerScore += that.getVal();
        } else if (winner.num === 0) {
            comp0Score += that.getVal();
        } else if (winner.num === 1) {
            comp1Score += that.getVal();
        } else {
            comp2Score += that.getVal();
        }
    }

}

//get ul last child to find most recent score see if difference of 26
    