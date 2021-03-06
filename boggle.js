(function() {
  var Board, DiceShaker, Display, LetterDice, Util, Word_builder, Word_entry, boggle;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  Util = {
    build_table_from_2d_cell_array: function(array_2d) {
      var row, table, td, tr, _i, _j, _len, _len2;
      table = $("<table border=1>");
      for (_i = 0, _len = array_2d.length; _i < _len; _i++) {
        row = array_2d[_i];
        tr = $("<tr>");
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          td = row[_j];
          tr.append(td);
        }
        table.append(tr);
      }
      return table;
    },
    shuffle_array: function(array) {
      return _.sortBy(array, Math.random);
    },
    random_char: function(s) {
      var i;
      i = Math.floor(Math.random() * s.length);
      return s.charAt(i);
    }
  };
  DiceShaker = (function() {
    function DiceShaker() {}
    DiceShaker.prototype.shake = function(num_squares, letter_dice) {
      var dice, numbers, _i, _results;
      if (num_squares !== letter_dice.length) {
        throw "unexpected number of dice";
      }
      numbers = (function() {
        _results = [];
        for (var _i = 0; 0 <= num_squares ? _i < num_squares : _i > num_squares; 0 <= num_squares ? _i += 1 : _i -= 1){ _results.push(_i); }
        return _results;
      }).apply(this, arguments);
      dice = Util.shuffle_array(numbers);
      return _.map(dice, function(die) {
        var letter;
        letter = Util.random_char(letter_dice[die]);
        if (letter === 'Q') {
          letter = 'QU';
        }
        return letter;
      });
    };
    return DiceShaker;
  })();
  Board = (function() {
    function Board(display, size, letter_dice) {
      var die, i, _len, _ref;
      this.display = display;
      this.size = size;
      this.num_squares = this.size * this.size;
      this.dice = new DiceShaker().shake(this.num_squares, letter_dice);
      _ref = this.dice;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        die = _ref[i];
        display.place_die(i, die);
      }
    }
    Board.prototype.get_letter = function(i) {
      return this.dice[i];
    };
    Board.prototype.for_all_squares = function(f) {
      var square, _ref, _results;
      _results = [];
      for (square = 0, _ref = this.num_squares; (0 <= _ref ? square < _ref : square > _ref); square += 1) {
        _results.push(f(square));
      }
      return _results;
    };
    Board.prototype.is_adjacent = function(s1, s2) {
      var c1, c2, r1, r2;
      if (s1 === s2) {
        return false;
      }
      r1 = Math.floor(s1 / this.size);
      c1 = s1 % this.size;
      r2 = Math.floor(s2 / this.size);
      c2 = s2 % this.size;
      return (Math.abs(r1 - r2) <= 1) && (Math.abs(c1 - c2) <= 1);
    };
    return Board;
  })();
  Display = function(size) {
    var scratchpad, self, word_entry_span;
    $("#boggle").append("<p>Click on letters to make words.</p>");
    (function() {
      var table, table_data;
      table_data = function() {
        var _i, _results;
        return _.map((function() {
          _results = [];
          for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i += 1 : _i -= 1){ _results.push(_i); }
          return _results;
        }).apply(this, arguments), function(row) {
          var _i, _results;
          return _.map((function() {
            _results = [];
            for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i += 1 : _i -= 1){ _results.push(_i); }
            return _results;
          }).apply(this, arguments), function(col) {
            var n;
            n = row * size + col;
            return $("<td>").attr("id", "pos" + n).css("height", "30px").css("width", "30px");
          });
        });
      };
      table = Util.build_table_from_2d_cell_array(table_data());
      return $("#boggle").append(table);
    })();
    word_entry_span = $("<span>");
    $("#boggle").append(word_entry_span);
    scratchpad = $("<pre>");
    $("#boggle").append("<h2>Answers</h2>");
    $("#boggle").append(scratchpad);
    return self = {
      square: function(i) {
        return $("#pos" + i);
      },
      index: function(element) {
        var id;
        id = $(element).attr("id");
        return parseInt(id.match(/\d+/)[0]);
      },
      place_die: function(i, value) {
        return self.square(i).html(value);
      },
      on_click_square: function(callback) {
        var handler;
        handler = function() {
          return callback(self.index(this));
        };
        return $("td").click(handler);
      },
      color: function(pos, color) {
        return self.square(pos).css("background", color);
      },
      word_entry: function() {
        var append_hidden_button, back_button, field, save_button, self;
        word_entry_span.html('');
        field = $("<pre>");
        word_entry_span.append(field);
        append_hidden_button = function(label) {
          var button;
          button = $("<input type='button'>");
          button.attr("value", label);
          word_entry_span.append(button);
          button.hide();
          return button;
        };
        back_button = append_hidden_button("BACK");
        save_button = append_hidden_button("SAVE");
        return self = {
          field: {
            set: function(text) {
              return field.html(text);
            }
          },
          back_button: {
            hide: function() {
              return back_button.hide();
            },
            show: function() {
              return back_button.show();
            },
            on_click: function(f) {
              return back_button.click(f);
            }
          },
          save_button: {
            hide: function() {
              return save_button.hide();
            },
            show: function() {
              return save_button.show();
            },
            on_click: function(f) {
              return save_button.click(f);
            }
          }
        };
      },
      scratchpad: {
        add_word: function(s) {
          return scratchpad.append(s + "\n");
        }
      }
    };
  };
  Word_builder = (function() {
    function Word_builder(board) {
      this.board = board;
      this.square_indexes = [];
    }
    Word_builder.prototype.add = function(i) {
      return this.square_indexes.push(i);
    };
    Word_builder.prototype.backspace = function() {
      return this.square_indexes.pop();
    };
    Word_builder.prototype.text = function() {
      return _.map(this.square_indexes, __bind(function(i) {
        return this.board.get_letter(i);
      }, this)).join('');
    };
    Word_builder.prototype.already_used = function(i) {
      return __indexOf.call(this.square_indexes, i) >= 0;
    };
    Word_builder.prototype.in_reach = function(new_i) {
      var last_square;
      if (this.square_indexes.length === 0) {
        return true;
      }
      last_square = this.last_square_selected();
      return this.board.is_adjacent(last_square, new_i);
    };
    Word_builder.prototype.validate_new_letter = function(new_i) {
      if (this.already_used(new_i)) {
        throw "already used";
      }
      if (!this.in_reach(new_i)) {
        throw "out of reach";
      }
    };
    Word_builder.prototype.last_square_selected = function() {
      if (this.square_indexes.length === 0) {
        return;
      }
      return this.square_indexes[this.square_indexes.length - 1];
    };
    Word_builder.prototype.redraw_board = function(display) {
      var color;
      color = __bind(function(i) {
        if (i === this.last_square_selected()) {
          return "lightgreen";
        }
        if (this.already_used(i)) {
          return "lightblue";
        }
        if (this.in_reach(i)) {
          return "white";
        }
        return "#DDD";
      }, this);
      return this.board.for_all_squares(function(i) {
        return display.color(i, color(i));
      });
    };
    return Word_builder;
  })();
  Word_entry = (function() {
    function Word_entry(board, display) {
      var _ref;
      this.board = board;
      this.display = display;
      this.word = new Word_builder(board);
      _ref = this.display.word_entry(), this.field = _ref.field, this.back_button = _ref.back_button, this.save_button = _ref.save_button;
      this.word.redraw_board(this.display);
      this.display.on_click_square(__bind(function(i) {
        return this.on_click_letter(i);
      }, this));
      this.back_button.on_click(__bind(function() {
        return this.backspace();
      }, this));
      this.save_button.on_click(__bind(function() {
        return this.save();
      }, this));
    }
    Word_entry.prototype.redraw = function() {
      var text;
      this.word.redraw_board(this.display);
      text = this.word.text();
      this.field.set(text);
      if (text.length > 0) {
        this.back_button.show();
        return this.save_button.show();
      } else {
        this.back_button.hide();
        return this.save_button.hide();
      }
    };
    Word_entry.prototype.on_click_letter = function(i) {
      try {
        this.word.validate_new_letter(i);
      } catch (error) {
        alert(error);
        return;
      }
      this.word.add(i);
      return this.redraw();
    };
    Word_entry.prototype.backspace = function() {
      this.word.backspace();
      return this.redraw();
    };
    Word_entry.prototype.save = function() {
      this.display.scratchpad.add_word(this.word.text());
      this.word = new Word_builder(this.board);
      return this.redraw();
    };
    return Word_entry;
  })();
  LetterDice = ["AAEEGN", "ELRTTY", "AOOTTW", "ABBJOO", "EHRTVW", "CIMOTU", "DISTTY", "EIOSST", "DELRVY", "ACHOPS", "HIMNQU", "EEINSU", "EEGHNW", "AFFKPS", "HLNNRZ", "DEILRX"];
  boggle = function() {
    var size;
    size = 4;
    return (function() {
      var board, display;
      display = Display(size);
      board = new Board(display, size, LetterDice);
      return new Word_entry(board, display);
    })();
  };
  jQuery(document).ready(function() {
    return boggle();
  });
}).call(this);
