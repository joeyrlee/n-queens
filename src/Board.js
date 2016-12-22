// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var pieceCount = 0;
      _.each(row, function(position) {
        if (!!position) {
          pieceCount++;
        }
      });
      return pieceCount > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var matrix = this.attributes;
      var hasConflicts = false;
      for (var row in matrix) {
        if (this.hasRowConflictAt(row)) {
          return true;
        }
      }
      return hasConflicts;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var pieceCount = 0;
      // loop through each row at the same index
      _.each(this.attributes, function(row) {
        // check if col has conflict
        if (!!row[colIndex]) {
          pieceCount++;
        }
      });
      return pieceCount > 1; 
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.attributes;
      var hasConflicts = false;
      // loop through matrix to access each row
      for (var row in matrix) {
        // loop through number of columns ('n')
        for (var i = 0; i < matrix.n; i++) {
          // using hasColConflictAt, check if each column (row[i]) has conflict
          if (this.hasColConflictAt(row[i])) {
            return true;
          }
        }
      }
      return hasConflicts;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var pieceCount = 0;
      // while (colIndex < 4) {
      console.log(this.rows())
      for (var i = 0; i < this.rows().length; i++) {
        //if input < 0
        if (majorDiagonalColumnIndexAtFirstRow < 0 || majorDiagonalColumnIndexAtFirstRow > this.rows().length - 1) {
          //do nothing
        } else {
          //if piece is present at location
          if (!!this.rows()[i][majorDiagonalColumnIndexAtFirstRow]) {
            //increment pieceCount
            pieceCount++;
          }
        }
        //increment column index to facilitate diagonal searching
        majorDiagonalColumnIndexAtFirstRow++;
      }
      return pieceCount > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //starting column for iterative calls to hasMajorDiagonalConflictAt is n - 2
      var startCol = this.rows().length - 2;
      //the number of diagonal sequence searches to conduct is fib(n)
      var fib = 2 * (this.rows().length) - 3;
      var results = false;
      //for fib(n) searches
      for (var i = startCol; i > startCol - fib; i--) {
        //if major diagonal conflict at index
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return results; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict

    //
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var pieceCount = 0;
      // while (colIndex < 4) {
      for (var i = 0; i < this.rows().length; i++) {
        //if input < 0
        if (minorDiagonalColumnIndexAtFirstRow < 0 || minorDiagonalColumnIndexAtFirstRow > this.rows().length - 1) {
          //do nothing
        } else {
          //if piece is present at location
          if (!!this.rows()[i][minorDiagonalColumnIndexAtFirstRow]) {
            //increment pieceCount
            pieceCount++;
          }
        }
        //increment column index to facilitate diagonal searching
        minorDiagonalColumnIndexAtFirstRow--;
      }
      return pieceCount > 1; 
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //the column at which to begin the minor diagonal sequences
      //(as well as the number overall) is fib(n)
      var startCol = 2 * (this.rows().length) - 3;
      var results = false;
      //for fib(n) searches
      for (var i = startCol; i > 0; i--) {
        //if major diagonal conflict at index
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return results; 
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
