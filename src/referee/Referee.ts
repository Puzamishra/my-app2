import {
    PieceType,
    TeamType,
    Piece,
    Position,
  } from "../Constants";
  
  import { 
    
     
    knightMove 
    
  } from "./rules";
  
  export default class Referee {
    isEnPassantMove(
      initialPosition: Position,
      desiredPosition: Position,
      type: PieceType,
      team: TeamType,
      boardState: Piece[]
    ) {
      const pawnDirection = team === TeamType.OUR ? 1 : -1;
  
      
  
      return false;
    }
  
    //TODO
    //Pawn promotion!
    //Prevent the king from moving into danger!
    //Add castling!
    //Add check!
    //Add checkmate!
    //Add stalemate!
    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
      let validMove = false;
      switch (type) {
        
        
      case PieceType.KNIGHT:
        validMove = knightMove(initialPosition, desiredPosition, team, boardState);
        break;
      
    }

     
      
  
      return validMove;
    }
  }