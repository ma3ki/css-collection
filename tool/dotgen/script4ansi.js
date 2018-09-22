class DotGen {
  /**
   * DotGen
   * @param {HTMLElement} grid
   */
  constructor(grid) {
    this.mode = "paint";
    this.color = "#FF0000";
    this.columns = 8;
    this.rows = 8;
    this.grid = grid;

    this.resetEventListner();
  }

  /**
   * 描画モードを変更する
   * @param {string} mode paint | eraser
   */
  changeMode(mode) {
    this.mode = mode || "paint";
  }

  /**
   * 描画色を変更する
   * @param {string} color #xxxxxx
   */
  changeColor(color) {
    this.color = color || "#FF0000";
  }

  /**
   * グリッドサイズを変更する
   * @param {string} {number} 
   */
  changeSize() {

    Array.from(this.grid.querySelectorAll("div")).forEach(el => {
      this.removeChild(el);
    });

    [...Array(columns.value * rows.value)].forEach(i => {
      const div = document.createElement("div");
      this.grid.appendChild(div);
    });

    this.resetEventListner();

    this.grid.style.gridTemplateColumns = "1fr ".repeat(
      columns.value
    );
    this.grid.style.gridTemplateRows = "1fr ".repeat(
      rows.value
    );
  }

  /**
   * 子要素とそのイベントリスナを削除する
   * @param {HTMLElement} el
   */
  removeChild(el) {
    el.removeEventListener("click", this.draw.bind(this, el));
    el.parentElement.removeChild(el);
  }

  /**
   * イベントリスナを再設定する
   */
  resetEventListner() {
    Array.from(this.grid.querySelectorAll("div")).forEach(el => {
      el.addEventListener("click", this.draw.bind(this, el));
    });
  }

  /**
   * 描画する
   * @param {HTMLElement} el
   */
  draw(el) {
    const red = parseInt(this.color.substring(1,3),16);
    const green = parseInt(this.color.substring(3,5),16);
    const blue = parseInt(this.color.substring(5,7),16);

    if (el.style.backgroundColor === "rgb(" + red + ", " + green + ", " + blue + ")" ) {
      el.style.backgroundColor = "transparent"
    } else {
      el.style.backgroundColor =
        this.mode === "paint" ? this.color : "transparent";
    }

    console.log(this.output());
  }

  /**
   * 結果を出力する
   * black   #000000 '\033[0;40m '
   * red     #FF0000 '\033[0;41m '
   * green   #008000 '\033[0;42m '
   * yellow  #FFFF00 '\033[0;43m '
   * blue    #0000FF '\033[0;44m '
   * magenta #FF00FF '\033[0;45m '
   * cyan    #00FFFF '\033[0;46m '
   * white   #FFFFFF '\033[0;47m '
   * eol             '\033[0;0m '
   */
  output() {
    const boxShadows = Array.from(this.grid.querySelectorAll("div")).map(
      (el, i) => {
        const defaultColorCode = '\\033[0;40m ';
	var colorCode ;
        switch (el.style.backgroundColor) {
          case "rgb(0, 0, 0)":       colorCode = '\\033[0;40m '; break ;
          case "rgb(255, 0, 0)":     colorCode = '\\033[0;41m '; break ;
          case "rgb(0, 128, 0)":     colorCode = '\\033[0;42m '; break ;
          case "rgb(255, 255, 0)":   colorCode = '\\033[0;43m '; break ;
          case "rgb(0, 0, 255)":     colorCode = '\\033[0;44m '; break ;
          case "rgb(255, 0, 255)":   colorCode = '\\033[0;45m '; break ;
          case "rgb(0, 255, 255)":   colorCode = '\\033[0;46m '; break ;
          case "rgb(255, 255, 255)": colorCode = '\\033[0;47m '; break ;
        }
        return [
          colorCode || defaultColorCode
        ].join(" ");
      }
    );

    const result = (function() { 
      var code = 'echo -e "';
      boxShadows.forEach(function(value, index) {
        if ( ( index + 1 ) % columns.value === 0 ) {
          code += value + "\\033[0;0m \n" ;
        } else {
          code += value ;
        }
      });
      code += '"\n' ;
      return code ;
    })();

    document.getElementById("output").value = result;
  }
}

const main = () => {
  const grid = document.querySelector(".dot-grid");
  const dotGen = new DotGen(grid);

  dotGen.changeSize();

  document.getElementById("columns").addEventListener("change", e => {
    dotGen.changeSize();
  });

  document.getElementById("rows").addEventListener("change", e => {
    dotGen.changeSize();
  });

  document.getElementById("color").addEventListener("change", e => {
    const color = e.target.value;
    dotGen.changeColor(color);

    document.getElementById("current-color").innerText = color;
  });

  document.getElementById("control-paint").addEventListener("click", () => {
    dotGen.changeMode("paint");
  });
  document.getElementById("control-eraser").addEventListener("click", () => {
    dotGen.changeMode("eraser");
  });
};

main();
