
const gameboard = document.querySelector(".gameboard")
const start = document.querySelector(".new-game-button")
const rules = document.querySelector(".rules-button")
const rulesText = document.querySelector(".rules-text")
rules.addEventListener("click", ()=>{
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

    playRound(){
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
                        .then(()=>{
                            //debugger
                            setTimeout(() => that.thePlay(), 2000)
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
        /// chain the thens
    }

    thePlay(){
        const that = this
        return new Promise((resolve, reject) => {
            let idx
            let trick
            let allCards = []
            that.players.forEach(player => {
                allCards = allCards.concat(player.cards)
            })
            if(allCards.length > 0){
                if(that.firstTrick){
                    that.players.forEach(player => {
                        if (player.hasTwoOfClubs()){
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
                                    that.players[idx].playOne(trick).then(() => resolve("success"))
                                    that.firstTrick = false
                                }, 2000)
                                })
                                , 2000)}), 2000)})
                }else{
                    //debugger
                    idx = that.players.indexOf(that.winner)
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
                                            that.players[idx].playOne(trick)
                                            resolve("success")
                                        }, 2000)
                                    })
                                    , 2000)
                            }), 2000)
                    })
                }
            }else{
                //show scoreboard
                that.ended = true
                resolve("success")
            }
        })
    }

    round0(){
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

    round1(){
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

    round2(){
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

    round3(){
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

    hasTwoOfClubs(){
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
            this.compHand.removeChild(card.cardLi)
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

    pickLead(game){
        let starter
        const that = this
        return new Promise((resolve, reject) => {
            if(game.firstTrick){
                that.cards.forEach(card => {
                    if(card.suit === "Clubs" && card.rank === 2){
                        starter = card
                    }
                })
            }else if(game.heartsBroken){
                starter = that.cards.slice(0, 1)
            }else{
                that.cards.forEach(card => {
                    if (card.suit !== "Hearts") {
                        starter = card
                        // break?
                    }
                })
                if(!starter){
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

    playOne(trick){
        const that = this 
        return new Promise((resolve, reject) => {

        
            let choice
            //if trick.pile[0] is 2 clubs
            let playable = that.cards.filter(card => {
                if(trick.suit !== "Hearts"){
                    if(card.suit === trick.suit){
                        return card
                    }    
                }else{
                    if(card.rank > trick.rank && card.suit === "Hearts"){
                        return card
                    }
                }
            })
            if (trick.suit === "Clubs" && trick.pile[0].rank === 2) {
                playable = playable.filter(card => card.suit !== "Hearts" && (card.rank !== 12 && card.suit !== "Spades"))
            }
            if (playable.length > 0){
                choice = playable[0]
            }else if(trick.suit === "Hearts"){
                let hearts = that.cards.filter(card => card.suit === trick.suit)
                if(hearts.first){
                    choice = hearts.first
                }else{
                    choice = that.cards.first
                }
            }else{
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

    pickLead(game){
        const that = this
        let choice
        return new Promise((resolve, reject) => {
            if(game.firstTrick && that.hasTwoOfClubs()){
                let twoClubsMessage = document.createElement("DIV")
                gameboard.append(twoClubsMessage)
                twoClubsMessage.append("You have the 2 of Clubs Begin the Round by playing it")
                twoClubsMessage.classList.add("message")
                choice = that.cards[0]
                choice.cardLi.addEventListener("click", () => {
                    choice.cardLi.parentElement.removeChild(choice.cardLi)
                    that.cards = that.cards.slice(1)
                    gameboard.removeChild(twoClubsMessage)
                    let theCard = choice
                    theCard.cardLi.classList.add("player0")
                    resolve(theCard)
                })
                
            }else if(game.heartsBroken){
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                that.cards.forEach(card => {
                    card.cardLi.addEventListener("click", () => {
                        choice = card
                        gameboard.removeChild(pickLeadMessage)
                        choice.cardLi.parentElement.removeChild(choice.cardLi)
                        let idx = that.cards.indexOf(choice)
                        let left = that.cards.slice(0, idx)
                        let right = that.cards.slice(idx + 1)
                        that.cards = left.concat(right)
                        let theCard = choice
                        theCard.cardLi.classList.add("player0")
                        resolve(theCard)
                    })
                })
            }else{
                let pickLeadMessage = document.createElement("DIV")
                gameboard.append(pickLeadMessage)
                pickLeadMessage.append("You won the last round lead with the card of your choice")
                pickLeadMessage.classList.add("message")
                let options = that.cards.filter(card => card.suit !== "Hearts")
                if(options.length > 0){ 
                    that.cards.forEach(card => {
                        if(card.suit !== "Hearts"){
                            card.cardLi.addEventListener("click", () => {
                                choice = card
                                //debugger
                                choice.cardLi.parentElement.removeChild(choice.cardLi)
                                gameboard.removeChild(pickLeadMessage)
                                let idx = that.cards.indexOf(choice)
                                let left = that.cards.slice(0, idx)
                                let right = that.cards.slice(idx + 1)
                                that.cards = left.concat(right)
                                let theCard = choice
                                theCard.cardLi.classList.add("player0")
                                resolve(theCard)
                            })
                        }

                    })
                }else{
                    that.cards.forEach(card => {
                        card.cardLi.addEventListener("click", () => {
                            choice = card
                            choice.cardLi.parentElement.removeChild(choice.cardLi)
                            gameboard.removeChild(pickLeadMessage)
                            let idx = that.cards.indexOf(choice)
                            let left = that.cards.slice(0, idx)
                            let right = that.cards.slice(idx + 1)
                            that.cards = left.concat(right)
                            let theCard = choice
                            theCard.cardLi.classList.add("player0")
                            resolve(theCard)
                        })
                    })
                }
            }
        })
    }

    playOne(trick){
        //if trick.pile[0] is 2 clubs
        const that = this 
        let options
        let choice
        return new Promise((resolve, reject) => {
            let playOneMessage = document.createElement("DIV")
            gameboard.append(playOneMessage)
            playOneMessage.classList.add("play-one-message")
            if(trick.suit === "Hearts"){
                playOneMessage.append("Your turn remember you must go up in hearts if you can")
                trick.pile
                options = that.cards.filter(card => card.suit === "Hearts" && card.rank > highest)
                if (options.length === 0) {
                    options = that.cards.filter(card => card.suit === trick.suit)
                }
            }else{
                playOneMessage.append("Your turn")
                options = that.cards.filter(card => card.suit === trick.suit)
            }
            if(options.length === 0){
                options = that.cards
            }
            if (trick.suit === "Clubs" && trick.pile[0].rank === 2) {
                options = options.filter(card => card.suit !== "Hearts" && (card.rank !== 12 && card.suit !== "Spades"))
            }
            if (options.length === 0) {
                options = that.cards
            }
            
            options.forEach(card =>{
                card.cardLi.addEventListener("click", () => {
                    choice = card
                    //debugger
                    choice.cardLi.parentElement.removeChild(choice.cardLi)
                    gameboard.removeChild(playOneMessage)
                    let idx = that.cards.indexOf(choice)
                    let left = that.cards.slice(0, idx)
                    let right = that.cards.slice(idx + 1)
                    that.cards = left.concat(right)
                    choice.cardLi.classList.add("player0")
                    trick.accept(choice)
                    that.cards = that.cards.map(card => {
                        let dup = card 
                        return dup
                    })
                    resolve(choice)
                })
            })
        })
    }

    selectThree(player) {
        const that = this
        return new Promise((resolve, reject) => {
            let unwanted = []
            let passBtn = document.createElement("BUTTON")
            that.cards = that.cards.map(card => {
                card.cardLi.addEventListener("click", () => {
                    unwanted.length < 3 ? card.cardLi.classList.toggle("select") : card.cardLi.classList.remove("select")
                    if (card.cardLi.classList.contains("select")) {
                        unwanted.push(card)
                    } else {
                        let i = unwanted.indexOf(card)
                        let left = unwanted.slice(0, i)
                        let right = unwanted.slice(i + 1)
                        unwanted = left.concat(right)
                    }

                    if (unwanted.length === 3) {
                        passBtn.classList.remove("hide-button")
                        let dup = card.cardLi
                        // passBtn = document.createElement("BUTTON")
                        gameboard.append(passBtn)
                        passBtn.innerHTML = "";
                        passBtn.append("PASS")
                        passBtn.addEventListener("click", () => {
                            card.cardLi.classList.remove("select")
                            card.cardLi.parentElement.replaceChild(dup, card.cardLi)
                            that.passThree(unwanted)
                            player.acceptThree(unwanted)
                            passBtn.classList.add("hide-button")
                            resolve("success")
                        })
                    } else {
                        passBtn.classList.add("hide-button")
                    }
                })
                return card
            })
        })
    }

    passThree(unwanted) {
        const that = this

        unwanted = unwanted.map(card => {
            card.hide()
            that.playerHand.removeChild(card.cardLi) //??????
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
        this.show()
    }

    clear(){
        const that = this
        let clearTrick = document.querySelector(".trick")
        if (clearTrick) {
            gameboard.removeChild(clearTrick)
        }
        that.pile = [];
    }

    show(){
        const that = this
        let clearTrick = document.querySelector(".trick")
        if(clearTrick){
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
        if(that.pile.length > 3){
            setTimeout(() => that.clear(), 3000)
        }
    }

    accept(card) {
        let dup = card
        const that = this
        that.pile.push(dup)
        that.show()
        //debugger
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

}



// add function to trick class to add to scorboard
// call score(that.winner) in the play function of the game class on the trick instance
// 