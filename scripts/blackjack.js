'use strict';

var StandardPack = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,'J','J','J','J','Q','Q','Q','Q','K','K','K','K','A','A','A','A'];
var CardIndexer=[];
var NumberOfPacks;
var ObjCardTable=document.querySelector('.CardTable');
var GetCard;
var Money=2000 //most veszünk alapértéket
var MoneyAll=[];
var MoneyAllPrevious;
var BetAll=[];
var NumberOfPlayers;
var Players=[];
var splitIndependentIndex=[];
var cardplayers=[];
var cardplayerchanger=0;
var ActualPlayer=0;
var ActualPlayerSplitted=0;
var End=0;
var initializator=0;
var differencia;
//function InitializationFormGenerator(){} Number of players and Usernames, Money

function start(){
    if (initializator==0){
        firstinitialization();
    }
    restart();
    console.log('?');
    MoneyAllPrevious=MoneyAll.map(function(item,index,arr){return item;});
    End=0;
    Players[1].active=true;
    if(CardIndexer.length<5*NumberOfPlayers){
        shuffler();
        alert('újrakeverve');
    }
    playerOptionsInitialization();
    document.getElementById('start').style.visibility="hidden";   
}

function restart(){
    Players=[];
    splitIndependentIndex=[];
    cardplayers=[];
    BetAll=[];
    for(var j=0;j<NumberOfPlayers;j++){
        Players.push(new Player);
        splitIndependentIndex.push(j);
        cardplayers.push(j);
        BetAll.push(0);
    }
    BetAll.pop();
}

function firstinitialization(){
    NumberOfPacks=1;
    NumberOfPlayers=5;
    for(var j=0;j<NumberOfPlayers;j++){
        MoneyAll.push(Money);
    }
    MoneyAll.pop();
    initializator=1;
}

function shuffler(){
    for(var i=0;i<NumberOfPacks;i++){
        for(var k=0;k<StandardPack.length;k++){
            CardIndexer.push(k);
        }
    }
    shuffle(CardIndexer);
}

function spanDisplayer(String){
    var span1=document.createElement('SPAN');
    span1.classList.add('TexT');
    span1.innerText=String;
    return span1;
}

function buttonDisplayer(String,function1){
    var button1=document.createElement('BUTTON');
    var innerbutton1=document.createTextNode(String);
    button1.appendChild(innerbutton1);
    button1.addEventListener('click',function1);
    return button1;
}

function playerOptionsInitialization(){
    ObjCardTable.innerText='';

    
    for(var i=0;i<cardplayers.length;i++){
        var div=document.createElement('DIV');
        div.classList.add('TexT');
        var divchilddiv01=document.createElement('DIV');
        divchilddiv01.classList.add('TexT');
        if(i==0){
            div.classList.add('splitscreenboss');
            divchilddiv01.innerText='Casino';
            div.appendChild(divchilddiv01);
            if(End==1){
                div.appendChild(Players[i].cardvisualizer());
                div.appendChild(spanDisplayer(Players[i].score()+' points'))
            }
            else{
                div.appendChild(Players[i].cardvisualizer(1));
            }
            ObjCardTable.appendChild(div);
            
        }
        else{
            if(End==1){
                var divchilddiv03=document.createElement('DIV');
                divchilddiv03.innerText=ResultDisplay(ResultCount(i));
                MoneyAll[i-1]+=ResultCount(i)*BetAll[i-1]/2;
                div.appendChild(divchilddiv03);
            }
            div.classList.add('splitscreen');
            divchilddiv01.innerText=i+'. Player';
            div.appendChild(divchilddiv01);
            differencia=MoneyAll[i-1]-MoneyAllPrevious[i-1];
            div.appendChild(spanDisplayer('Money: '+MoneyAll[i-1]+' $ ('+differencia+') Actual bet: '+BetAll[i-1]+'$'));
            div.appendChild(Players[i].cardvisualizer());
            if(Players[i].score()>0){
                div.appendChild(spanDisplayer(Players[i].score()+' points'));
            }
            ObjCardTable.appendChild(div);
        }
        if(Players[i].active){
                div.classList.remove('splitscreen');
                div.classList.add('active');
                var divchilddiv02=document.createElement('DIV');
            if(Players[i].ablebet){
                
                var Bet=document.createElement('SELECT');
                var BetOptions=['',10,20,50,100,200,500,1000];
                for (var j = 0; j < BetOptions.length; j++) {
                    var option = document.createElement("option");
                    option.value = BetOptions[j];
                    option.text = BetOptions[j];
                    Bet.appendChild(option);
                }
                ActualPlayer=i;
                ActualPlayerSplitted=i;
                Bet.addEventListener('change',FunctionBet);
                var Betting=document.createElement('SPAN');
                Betting.classList.add('TexT');
                var innerBet=document.createTextNode('Bet');
                Betting.appendChild(innerBet);
                divchilddiv02.appendChild(Bet);
                divchilddiv02.appendChild(Betting);
            }
            else if(Players[i].ableplay){
                ActualPlayer=i;
                ActualPlayerSplitted=i;
                divchilddiv02.appendChild(buttonDisplayer('Hit',FunctionHit));
                if(Players[i].pack.length==2){
                    divchilddiv02.appendChild(buttonDisplayer('DoubleDown',FunctionDoubleDown));
                }
                divchilddiv02.appendChild(buttonDisplayer('Stand',FunctionStand));
                divchilddiv02.appendChild(buttonDisplayer('Surrender',FunctionSurrender)); 
            }
            div.appendChild(divchilddiv02);
        }

    }  
}

function deal(){
    for(var j=0;j<2;j++){
        for(var i=Players.length-1;i>=0;i--){
            GetCard=CardIndexer.pop();
            if(Players[i].pack.length<2){
                Players[i].index.push(GetCard);
                Players[i].pack.push(StandardPack[GetCard]);
            }
            else{CardIndexer.push(GetCard);}
            }
        }
    }

function FunctionHit(){
    GetCard=CardIndexer.pop();
    Players[ActualPlayerSplitted].index.push(GetCard);
    Players[ActualPlayerSplitted].pack.push(StandardPack[GetCard]);
    if(Players[ActualPlayerSplitted].score()>20){ 
        FunctionStand();
    }
    playerOptionsInitialization();
    }

function FunctionDoubleDown(){
    if(MoneyAll[ActualPlayer-1]>BetAll[ActualPlayer-1]){
        MoneyAll[ActualPlayer-1]=MoneyAll[ActualPlayer-1]-BetAll[ActualPlayer-1];
        BetAll[ActualPlayer-1]=BetAll[ActualPlayer-1]+BetAll[ActualPlayer-1];
        GetCard=CardIndexer.pop();
        Players[ActualPlayerSplitted].index.push(GetCard);
        Players[ActualPlayerSplitted].pack.push(StandardPack[GetCard]);
        FunctionStand();
    }
    else{
        alert('not enough money');
    }
}

function FunctionSplit(){

    }

function FunctionStand(){
        Players[ActualPlayer].active=false;
        Players[ActualPlayer].ableplay=false;
        if(ActualPlayer==Players.length-1){
            EndTurn();
        }
        else{
            Players[ActualPlayer+1].active=true;
        }
        playerOptionsInitialization();
    }
function FunctionInsurance(){

    }
function FunctionSurrender(){  
    MoneyAll[ActualPlayer-1]=MoneyAll[ActualPlayer-1]+BetAll[ActualPlayer-1]/2;
    BetAll[ActualPlayer-1]=BetAll[ActualPlayer-1]/2;
    Players[ActualPlayer].surrendered=true;
    FunctionStand();
    }
function FunctionBet(){
    var bet=event.target.value;
    Players[ActualPlayer].active=false;
    if(ActualPlayer==Players.length-1){
        Players[1].active=true;
        deal();
    }
    else{
        Players[ActualPlayer+1].active=true;
    }
    Players[ActualPlayer].ablebet=false;
    Players[ActualPlayer].ableplay=true;
    BetAll[ActualPlayer-1]=parseInt(bet);
    console.log(MoneyAllPrevious);
    MoneyAll[ActualPlayer-1]=MoneyAll[ActualPlayer-1]-bet;
    console.log(MoneyAllPrevious);
    playerOptionsInitialization();
    }
function Player(){
    this.pack=[];
    this.index=[];
    this.score=function(){
        var sum =0;
        var Asz =0;
        for(var i=0; i<this.pack.length; i++){
            if(this.pack[i]=='A'){
                Asz++;
            }
            sum += GetScore(this.pack[i]);
            if(Asz>0 && sum>21){
                sum=sum-10; Asz--;
            }
        }
        return sum;
    }
    this.cardvisualizer=function(x){
        var y=this.pack.length>2?this.pack.length:2;
        var divCards = document.createElement('DIV');
        for(var i=0; i<y; i++){
            var objCardx = document.createElement('IMG');
            objCardx.classList.add('CardImg');
            if(x<i+1){
                objCardx.src="images/cardback.jpg";
            }
            else{
                objCardx.src = CardPicture(this.index[i]);
            }
            divCards.appendChild(objCardx);
         }
         return divCards;
    }
    this.active=false;
    this.ablebet=true;
    this.ableplay=false;
    this.ablesplit=false;
    this.winner=false;
    this.surrendered=false;
    }

function CardPicture(CardGot){
    var sarc;
    switch(CardGot){
        case 0:
            sarc="images/2_of_clubs.png";
            break;
        case 1:
            sarc="images/2_of_diamonds.png";
            break;
        case 2:
            sarc="images/2_of_hearts.png";
            break;
        case 3:
            sarc="images/2_of_spades.png";
            break;
        case 4:
            sarc="images/3_of_clubs.png";
            break;
        case 5:
            sarc="images/3_of_diamonds.png";
            break;
        case 6:
            sarc="images/3_of_hearts.png";
            break;
        case 7:
            sarc="images/3_of_spades.png";
            break;
        case 8:
            sarc="images/4_of_clubs.png";
            break;
        case 9:
            sarc="images/4_of_diamonds.png";
            break;
        case 10:
            sarc="images/4_of_hearts.png";
            break;
        case 11:
            sarc="images/4_of_spades.png";
            break;
        case 12:
            sarc="images/5_of_clubs.png";
            break;
        case 13:
            sarc="images/5_of_diamonds.png";
            break;
        case 14:
            sarc="images/5_of_hearts.png";
            break;
        case 15:
            sarc="images/5_of_spades.png";
            break;
        case 16:
            sarc="images/6_of_clubs.png";
            break;
        case 17:
            sarc="images/6_of_diamonds.png";
            break;
        case 18:
            sarc="images/6_of_hearts.png";
            break;
        case 19:
            sarc="images/6_of_spades.png";
            break;
        case 20:
            sarc="images/7_of_clubs.png";
            break;
        case 21:
            sarc="images/7_of_diamonds.png";
            break;
        case 22:
            sarc="images/7_of_hearts.png";
            break;
        case 23:
            sarc="images/7_of_spades.png";
            break;
        case 24:
            sarc="images/8_of_clubs.png";
            break;
        case 25:
            sarc="images/8_of_diamonds.png";
            break;
        case 26:
            sarc="images/8_of_hearts.png";
            break;
        case 27:
            sarc="images/8_of_spades.png";
            break;
        case 28:
            sarc="images/9_of_clubs.png";
            break;
        case 29:
            sarc="images/9_of_diamonds.png";
            break;
        case 30:
            sarc="images/9_of_hearts.png";
            break;
        case 31:
            sarc="images/9_of_spades.png";
            break;
        case 32:
            sarc="images/10_of_clubs.png";
            break;
        case 33:
            sarc="images/10_of_diamonds.png";
            break;
        case 34:
            sarc="images/10_of_hearts.png";
            break;
        case 35:
            sarc="images/10_of_spades.png";
            break;
        case 36:
            sarc="images/jack_of_clubs2.png";
            break;
        case 37:
            sarc="images/jack_of_diamonds2.png";
            break;
        case 38:
            sarc="images/jack_of_hearts2.png";
            break;
        case 39:
            sarc="images/jack_of_spades2.png";
            break;
        case 40:
            sarc="images/queen_of_clubs2.png";
            break;
        case 41:
            sarc="images/queen_of_diamonds2.png";
            break;
        case 42:
            sarc="images/queen_of_hearts2.png";
            break;
        case 43:
            sarc="images/queen_of_spades2.png";
            break;
        case 44:
            sarc="images/king_of_clubs2.png";
            break;
        case 45:
            sarc="images/king_of_diamonds2.png";
            break;
        case 46:
            sarc="images/king_of_hearts2.png";
            break;
        case 47:
            sarc="images/king_of_spades2.png";
            break;
        case 48:
            sarc="images/ace_of_clubs.png";
            break;
        case 49:
            sarc="images/ace_of_diamonds.png";
            break;
        case 50:
            sarc="images/ace_of_hearts.png";
            break;
        case 51:
            sarc="images/ace_of_spades2.png";
            break;
        default:
            sarc="images/cardback.jpg"
    }
    return sarc;
}
function GetScore(Card){
    var szamertek;
    switch(Card){
        case 'B':
        case 'J':
            szamertek =10;
            break;
        case 'D':
        case 'Q':
            szamertek =10;
            break;
        case 'R':
        case 'K':
            szamertek =10;
            break;
        case 'A':
            szamertek =11;
            break;
        default:
            szamertek=parseInt(Card);
    }
    return szamertek;
}
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
function EndTurn(){
    End=1;
    while(Players[0].score()<17){
        GetCard=CardIndexer.pop();
        Players[0].index.push(GetCard);
        Players[0].pack.push(StandardPack[GetCard]);
    }
    playerOptionsInitialization();
    document.getElementById('start').style.visibility="visible";
}

function ResultCount(i){
    if(Players[i].surrendered){
        return 0;
    }
    else if(Players[i].score()>21){
        return 0;
    }
    else if(Players[i].score()==21){
        if(Players[0].score()==21){
            if(Players[i].pack.length==2){
                if(Players[0].pack.lengt==2){
                    return 1;
                }
                else{
                    return 3;
                }
            }
            else{
                if(Players[0].pack.length==2){
                    return 0;
                }
                else{
                    return 1;
                }
            }
        }
        else{
            if(Players[i].pack.length==2){
                return 3;
            }
            else{
                return 2;
            }
        }
    }
    else{
        if(Players[0].score()<22){
            if(Players[i].score()>Players[0].score()){
                return 2;
            }
            else if(Players[i].score()==Players[0].score()){
                return 1;
            }
             else{
                return 0;
            }
        }
        else{
            return 2;
        }
    }
}

function ResultDisplay(n){
    var string;
    switch(n){
        case 0:
            string="You Lost";
            break;
        case 1:
            string="Tie";
            break;
        case 2:
            string="You Won";
            break;
        case 3:
            string="You Won with a Black Jack";
            break;
    }
    return string;
}
