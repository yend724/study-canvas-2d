(() => {
  class Vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
    multi(num) {
      this.x *= num;
      this.y *= num;
      return this;
    }
    mag() {
      const { x, y } = this;
      return Math.sqrt(x ** 2 + y ** 2);
    }
    normalized() {
      const { x, y, mag } = this;
      return new Vector2(x / mag(), y / mag());
    }
  }

  class Ball {
    constructor(p, v, r) {
      this.p = p;
      this.v = v;
      this.r = r;
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ball = new Ball(
      new Vec2(canvas.width / 2, canvas.height - 30),
      new Vec2(3, -3),
      10
    );

    const paddle = new Ball(
      new Vec2(canvas.width / 2, canvas.height),
      new Vec2(0, 0),
      20
    );

    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 3;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;
    let bricks = [];
    let score = 0;
    let lives = 3;

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status === 0) continue;
          if (
            ball.p.x > b.x &&
            ball.p.x < b.x + brickWidth &&
            ball.p.y > b.y &&
            ball.p.y < b.y + brickHeight
          ) {
            ball.v.y = -ball.v.y;
            b.status -= 1;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              //document.location.reload();
            }
          }
        }
      }
    };

    const mouseMoveHandler = (e) => {
      let relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddle.p.x = relativeX;
      }
    };

    const keyDownHandler = (e) => {
      if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
      } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e) => {
      if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
      } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
      }
    };

    const drawScore = () => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Score: " + score, 8, 20);
    };

    const drawLives = () => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.arc(paddle.p.x, paddle.p.y, paddle.r, 0, Math.PI * 2, false);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.p.x, ball.p.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const getDistance = (x1, y1, x2, y2) => {
      const dd = (x1 - x2) ** 2 + (y1 - y2) ** 2;
      return Math.sqrt(dd);
    };

    let id;
    let stop = false;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      //drawBricks();
      //drawLives();
      //drawScore();
      //collisionDetection();

      if (
        ball.p.x + ball.v.x > canvas.width - ball.r ||
        ball.p.x + ball.v.x < ball.r
      ) {
        ball.v.x *= -1;
      }

      if (
        ball.p.y + ball.v.y < ball.r ||
        ball.p.y + ball.v.y > canvas.height - ball.r
      ) {
        ball.v.y *= -1;
      }

      const distance = getDistance(
        ball.p.x + ball.v.x,
        ball.p.y + ball.v.y,
        paddle.p.x,
        canvas.height
      );

      if (distance <= ball.r + paddle.p.r) {
        ball.v.y *= -1;
      }
      // if (y + ball.v.y < ball.r) {
      //   ball.v.y = -ball.v.y;
      // }
      // if (y + ball.v.y > canvas.height - ball.r) {
      //   if (x > paddle.p.x - paddle.p.r && x < paddle.p.x + paddle.p.r) {
      //     ball.v.y = -ball.v.y;
      //   } else {
      //     lives--;
      //     if (lives === 0) {
      //       alert("GAME OVER");
      //       stop = true;
      //     }
      //     ball.v.x = 3;
      //     ball.v.y = -3;
      //     paddle.p.x = (canvas.width - paddle.p.r) / 2;
      //   }
      // }

      if (rightPressed && paddle.p.x < canvas.width - paddle.p.r) {
        paddle.p.x += 7;
      }
      if (leftPressed && paddle.p.x > 0) {
        paddle.p.x -= 7;
      }

      ball.p.x += ball.v.x;
      ball.p.y += ball.v.y;

      id = requestAnimationFrame(draw);
      if (stop) {
        cancelAnimationFrame(id);
      }
    };

    draw();

    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
  });
})();
