import { useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  Piece,
  PieceType,
  TeamType,
  initialBoardState,
  Position,
  samePosition,
} from "../../Constants";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  //to grab a piece with the movement of mouse
  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function moveToEnd(){

  }
const [currentMoveNo, setValue] = useState<number>(0);
  const [currentLocation, setCurrentLocaiton] = useState<Position>({ x: 1, y: 7 });

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  
  function kightMove(initialPosition: Position, desiredPosition: Position) {
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          //TOP AND BOTTOM SIDE MOVEMENT
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (
                true
              ) {
                return true;
              }
            }
          }
  
          //RIGHT AND LEFT SIDE MOVEMENT
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (
                true
              ) {
                return true;
              }
            }
          }
        }
      }
      return false;
  }
    
  // first step to move the piece towards end position from the starting position
  function getEndAndAllMove(startPosition: Position){
  
    var allChessTile=[];
  
     for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        allChessTile.push({x:i,y:j});	
      }
      }
      
    var valid_position=[];
  
    var endPosition={};
  
    var currentPosition=startPosition;
  
    var allPosition=[];
  
  
    var counter=1;
  
    do{
  
    var valid_position=[];
  
    counter=counter+1;
  
      for(let i=0;i<allChessTile.length;i++){
  
        if(kightMove(currentPosition,allChessTile[i])){
          
          valid_position.push(allChessTile[i]);			
          
        }	
        
      }
      
      if(valid_position.length>0){
        currentPosition=valid_position[getRandomInt(0,valid_position.length-1)];	
      }
      
      allPosition.push(currentPosition);
      
      if(counter>10){
        break;
      }
  
    }while(1);
  
    endPosition=currentPosition;
  
    return {end:endPosition,allMove:allPosition};
  
  }


  function setInit(){
    const el = document.getElementById('kight-id');  

    setActivePiece(el);

    
  }
// first step to move the piece towards end position from the starting position
  function movetoNext(){
    var endMoves= getEndAndAllMove({x:1,y:7});
    dropPiece(endMoves.allMove[currentMoveNo]["x"],endMoves.allMove[currentMoveNo]["y"]);
    setCurrentLocaiton({x:endMoves.allMove[currentMoveNo]["x"],y:endMoves.allMove[currentMoveNo]["y"]})

    console.log(currentLocation);

setValue(currentMoveNo+1);
    console.log(endMoves.allMove);
    console.log(currentMoveNo);

      const el = document.getElementById('kight-id');  

      setActivePiece(el);
  }
  

  function dropPiece(x:number,y:number) {    

    console.log("Yes");
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {

      const grabPosition=currentLocation;

      const currentPiece = pieces[0];
	  
	   
      if (currentPiece) {
        const validMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else if (validMove) {
          //UPDATES THE PIECE POSITION
          //AND IF A PIECE IS ATTACKED, REMOVES IT
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              //SPECIAL MOVE
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;
                
              piece.position.x = x;
              piece.position.y = y;

              let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

              if(y === promotionRow && piece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else {
          //RESETS THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  function promotePawn(pieceType: PieceType) {
    if(promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if(samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType;
        const teamType = (piece.team === TeamType.OUR) ? "w" : "b";
        let image = "";
        switch(pieceType) {
          case PieceType.KNIGHT: {
            image = "knight";
            break;
          }
          
          
        }
        piece.image = `assets/images/${image}_${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[])

    setPieces(updatedPieces);

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
    }
  }

  return (
    <>
      <div
        
        id="chessboard"
        ref={chessboardRef}
      >
        {board}

        
      </div>

      <button onClick={() => setInit()}>Start</button>
      <button onClick={() => movetoNext()}>Help</button>
    </>
  );
}
