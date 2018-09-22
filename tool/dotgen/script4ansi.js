class DotGen {
  /**
   * DotGen
   * @param {HTMLElement} grid
   */
  constructor(grid) {
    this.mode = "paint";
    this.color = "#FF0000";
    this.size = 8;
    this.pixel = 10;
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
   * 1ドットあたりのピクセル数を変更する
   * @param {number} pixel
   */
  changePixel(pixel) {
    this.pixel = pixel || 10;
  }

  /**
   * グリッドサイズを変更する
   * @param {number} size
   */
  changeSize(size) {
    this.size = size || 8;

    Array.from(this.grid.querySelectorAll("div")).forEach(el => {
      this.removeChild(el);
    });

    [...Array(size ** 2)].forEach(i => {
      const div = document.createElement("div");
      this.grid.appendChild(div);
    });

    this.resetEventListner();
/**
*    this.grid.style.gridTemplateColumns = this.grid.style.gridTemplateRows = "1fr ".repeat(
*      size
*    );
*/
    this.grid.style.gridTemplateColumns = "1fr ".repeat(
      size
    );
    this.grid.style.gridTemplateRows = "1fr ".repeat(
      size
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
    el.style.backgroundColor =
      this.mode === "paint" ? this.color : "transparent";

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
        if ( ( index + 1 ) % size.value === 0 ) {
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

  dotGen.changeSize(8);
  dotGen.changePixel(4);

  document.getElementById("size").addEventListener("change", e => {
    dotGen.changeSize(parseInt(e.target.value, 10));
  });

  document.getElementById("pixel").addEventListener("change", e => {
    dotGen.changePixel(parseInt(e.target.value, 10));
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
