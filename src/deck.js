import Card from "./card"



class Deck{
    constructor(){
        this.cards = []
        const suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"]
        this.populate = this.populate.bind(this)
        this.shuffle = this.shuffle.bind(this)
        this.populate(suits, ranks)
        this.shuffle()
    }

    populate(suits, ranks){
        for(let i = 0; i < suits.length; i++){
            for(let j = 0; j < ranks.length; j++){
                let card = new Card(suits[i], ranks[j])
                this.cards.push(card)
            }
        }
    }

//fisher/yates shuffle

    shuffle(){
        let i, j, temp;
        for (i = this.cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    deal(){
        let hand = this.cards.slice(0, 13)
        this.card = this.cards.slice(12, -1)
        return hand
    }
    
}


export default Deck