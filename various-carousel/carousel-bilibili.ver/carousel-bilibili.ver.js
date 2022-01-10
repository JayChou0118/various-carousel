//当前的图片序号
let curLabel = 0;
//总的图片数
let picNum;
//定时器
let timer;
//获取所有的圆按钮
let labels = document.querySelectorAll(".control-label label");
//获取所有的图片容器
let divs = document.querySelectorAll(".container ");
//标题元素
let title = document.querySelector(".title span");
//标题数组
let titles = [
  "局外人",
  "未能二人共舞，亦能万人大倒数",
  "The Universe will die one day",
  "《Rick and Morty》",
  "Scau 20计机4班 孜然",
  "Wubba lubba dub dub"
];

/* 初始化label */
if (labels.length < divs.length) {
  picNum = divs.length;
  let controlLabel = document.querySelector(".control-label");
  let temp = divs.length - labels.length;
  for (let i = 1; i <= temp; i++) {
    let label = document.createElement("label");
    let id = i + labels.length;
    label.id = "control" + id;
    label.className = "";
    controlLabel.append(label);
  }
  labels = document.querySelectorAll(".control-label label");
}

/*为每一个label按钮添加onclick事件*/
for (let i = 0; i < labels.length; i++) {
  labels[i].onclick = () => {
    //清空定时器
    clearTimeout(timer);
    //清空当前label的class
    labels[curLabel].className = "";

    // 1.如果 当前图片j 在 被选取图片i 之前，向左移出，否则向右移出
    // 2.其他图片j 在 被选取图片i 之前，先设置层级，再设置向左偏移
    // 3.其他图片j 在 被选取图片i 之后，先设置层级，再设置向右偏移
    for (let j = 0; j < labels.length; j++) {
      if (j == curLabel) {
        if (curLabel > i) divs[j].style.transform = "translateX(100%)";
        else divs[j].style.transform = "translateX(-100%)";
      } else if (j < i) {
        divs[j].style["z-index"] = -1;
        divs[j].style.transform = "translateX(-100%)";
      } else if (j > i) {
        divs[j].style["z-index"] = -1;
        divs[j].style.transform = "translateX(100%)";
      }
    }
    // 将被选取图片i 设置为 当前图片curLabel，并设置class，标题和层级，偏移为0。
    // 考虑特殊情况，设置不连续的前后关系：
    // 如被选取的为最后一个图片，那么第一张图片将放在最后一张图片的右边。
    curLabel = i;
    divs[(curLabel - 1 + picNum) % picNum].style.transform =
      "translateX(-100%)";
    divs[(curLabel + 1) % picNum].style.transform = "translateX(100%)";

    labels[curLabel].className = "active";
    divs[curLabel].style["z-index"] = picNum;
    divs[curLabel].style.transform = "translateX(0%)";
    title.innerText = titles[curLabel];
  };
}

/* 设置图片初始偏移 */

for (let i = 0; i < divs.length; i++) {
  divs[i].style["z-index"] = picNum - i;
  if (i != 0) divs[i].style.transform = "translate(100%)";
}

/* 控制轮播 */
function shift() {
  //将移走的图片
  divs[curLabel].style["z-index"] = picNum - 1;
  labels[curLabel].className = "";
  divs[curLabel].style.transform = "translateX(-100%)";

  //新移入的图片
  curLabel = ++curLabel % picNum;
  labels[curLabel].className = "active";
  //设置最高层级
  divs[curLabel].style["z-index"] = picNum;
  // divs[(curLabel - 1 + picNum) % picNum].style.transform = "translateX(-100%)";
  divs[(curLabel + 1) % picNum].style["z-index"] = 0;
  divs[(curLabel + 1) % picNum].style.transform = "translateX(100%)";

  divs[curLabel].style.transform = "translateX(0%)";
  title.innerText = titles[curLabel];
}
/* 设置定时器 */
timer = setInterval(shift, 3000);

/* 监听鼠标移入/移出轮播图 */
let carousel = document.querySelector(".main");
//鼠标移入：对图片顺序初始化
carousel.addEventListener("mouseenter", () => {
  clearTimeout(timer);
  for (let j = 0; j < labels.length; j++) {
    // if (j != curLabel) labels[j].className = "";

    if (j < curLabel) {
      divs[j].style["z-index"] = -1;
      divs[j].style.transform = "translateX(-100%)";
    } else if (j > curLabel) {
      divs[j].style["z-index"] = -1;
      divs[j].style.transform = "translateX(100%)";
    }
  }
  if (curLabel == picNum - 1) divs[0].style.transform = "translateX(100%)";
  else if (curLabel == 0)
    divs[picNum - 1].style.transform = "translateX(-100%)";
  // console.log("in");
});
//鼠标移出，重新设置定时器
carousel.addEventListener("mouseleave", () => {
  timer = setInterval(shift, 3000);
  // console.log("out");
});

/* 设置前后按钮 */
let leftBtn = document.querySelector("#left");
let rightBtn = document.querySelector("#right");

leftBtn.addEventListener(
  "click",
  throttle(() => {
    labels[(curLabel - 1 + picNum) % picNum].click();
  })
);

rightBtn.addEventListener(
  "click",
  throttle(() => {
    labels[(curLabel + 1) % picNum].click();
  })
);

/* 节流装饰器 */
function throttle(f) {
  let clicked = null;
  let isThrottle = false;
  return function wrapper() {
    if (isThrottle) {
      clicked = true;
      return;
    }
    f();
    isThrottle = true;
    setTimeout(() => {
      isThrottle = false;
      if (clicked) {
        wrapper();
        clicked = false;
      }
    }, 500);
  };
}
