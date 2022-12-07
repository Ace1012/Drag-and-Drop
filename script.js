const choices = document.getElementsByClassName("choice");
const ps = document.querySelectorAll("p[draggable=true]");

let dragItem = null;
let closestChild = null;
let vertical = true;

function changeOrientation() {
  vertical = !vertical;
  const content = document.getElementsByClassName("content")[0];
  content.style.gridTemplateColumns = vertical ? "" : "1fr";
  content.style.gridAutoRows = vertical ? "" : "fit-content";
  content.style.gap = vertical ? "" : "0.5em";

  [...choices].forEach((choice) => {
    choice.style.flexDirection = vertical ? "" : "row";
    choice.style.justifyContent = vertical ? "" : "start";
  });
}

function dragStart() {
  dragItem = this;
  this.classList.add("dragging");
}

function dragEnd() {
  dragItem = null;
  this.classList.remove("dragging");
}

function dragLeave(e) {
  e.preventDefault();
  this.style.border = "";
}

async function dragOver(e) {
  e.preventDefault();
  const children = [
    ...this.querySelectorAll("p[draggable=true]:not(.dragging)"),
  ];
  closestChild = await findClosestChild(
    children,
    vertical ? e.clientY : e.clientX
  ).child;

  this.style.border = "3px solid cyan";
}

function findClosestChild(children, pointerPosition) {
  return children.reduce(
    (closestChild, child) => {
      const childBox = child.getBoundingClientRect();
      const childPosition = vertical
        ? childBox.top + childBox.height / 2
        : childBox.left + childBox.width / 2;
      const diff = pointerPosition - childPosition;

      if (diff <= 0 && diff > closestChild.offset) {
        return { offset: diff, child: child };
      } else {
        return closestChild;
      }
    },
    { offset: Number.NEGATIVE_INFINITY, child: null }
  );
}

function drop(e) {
  e.preventDefault();
  if (closestChild === null) {
    this.appendChild(dragItem);
  } else {
    this.insertBefore(dragItem, closestChild);
  }
  closestChild = null;
  this.style.border = "";
}

function glow(e) {
  this.classList.toggle("glow");
  const removeGlow = setTimeout(() => {
    this.classList.toggle("glow");
    clearTimeout(removeGlow);
  }, 300);
}

for (let p of ps) {
  p.addEventListener("dragstart", dragStart);
  p.addEventListener("dragend", dragEnd);
  p.addEventListener("click", glow);
}

for (let choice of choices) {
  choice.addEventListener("dragover", dragOver);
  choice.addEventListener("dragleave", dragLeave);
  choice.addEventListener("drop", drop);
}
