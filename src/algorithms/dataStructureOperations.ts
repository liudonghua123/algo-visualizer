import { StackNode, QueueNode, LinkedListNode, DataStructureStep } from './dataStructureTypes';

export function* stackOperations(operations: string[]): Generator<DataStructureStep> {
  const stack: StackNode[] = [];

  for (const op of operations) {
    if (op.startsWith('push')) {
      const value = parseInt(op.split(' ')[1]);
      stack.push({ value, highlighted: true });

      yield {
        type: 'push',
        structure: stack.map((n, i) => ({ ...n, highlighted: i === stack.length - 1 })),
        highlightedIndices: [stack.length - 1],
        message: `入栈: ${value}`,
      };

      stack[stack.length - 1].highlighted = false;
    } else if (op === 'pop') {
      if (stack.length > 0) {
        const popped = stack[stack.length - 1];
        popped.highlighted = true;

        yield {
          type: 'pop',
          structure: stack.map((n, i) => ({ ...n, highlighted: i === stack.length - 1 })),
          highlightedIndices: [stack.length - 1],
          message: `出栈: ${popped.value}`,
        };

        stack.pop();
      }
    } else if (op === 'peek') {
      if (stack.length > 0) {
        stack[stack.length - 1].highlighted = true;

        yield {
          type: 'peek',
          structure: [...stack],
          highlightedIndices: [stack.length - 1],
          message: `查看栈顶: ${stack[stack.length - 1].value}`,
        };

        stack[stack.length - 1].highlighted = false;
      }
    }
  }

  yield {
    type: 'traverse',
    structure: stack,
    highlightedIndices: [],
    message: '栈操作完成',
  };
}

export function* queueOperations(operations: string[]): Generator<DataStructureStep> {
  const queue: QueueNode[] = [];

  for (const op of operations) {
    if (op.startsWith('enqueue')) {
      const value = parseInt(op.split(' ')[1]);
      queue.push({ value, highlighted: true });

      yield {
        type: 'push',
        structure: queue.map((n, i) => ({ ...n, highlighted: i === queue.length - 1 })),
        highlightedIndices: [queue.length - 1],
        message: `入队: ${value}`,
      };

      queue[queue.length - 1].highlighted = false;
    } else if (op === 'dequeue') {
      if (queue.length > 0) {
        queue[0].highlighted = true;

        yield {
          type: 'pop',
          structure: queue.map((n, i) => ({ ...n, highlighted: i === 0 })),
          highlightedIndices: [0],
          message: `出队: ${queue[0].value}`,
        };

        queue.shift();
      }
    } else if (op === 'peek') {
      if (queue.length > 0) {
        queue[0].highlighted = true;

        yield {
          type: 'peek',
          structure: [...queue],
          highlightedIndices: [0],
          message: `查看队首: ${queue[0].value}`,
        };

        queue[0].highlighted = false;
      }
    }
  }

  yield {
    type: 'traverse',
    structure: queue,
    highlightedIndices: [],
    message: '队列操作完成',
  };
}

export function* linkedListOperations(operations: string[]): Generator<DataStructureStep> {
  const list: LinkedListNode[] = [];

  for (const op of operations) {
    if (op.startsWith('insert')) {
      const parts = op.split(' ');
      const value = parseInt(parts[1]);
      const position = parts.length > 2 ? parseInt(parts[2]) : list.length;

      if (position === 0) {
        list.unshift({ value, next: list.length > 0 ? 1 : null, highlighted: true });
        if (list.length > 1) {
          list[1].next = list.length > 2 ? 2 : null;
        }
      } else if (position >= list.length) {
        if (list.length > 0) {
          list[list.length - 1].next = list.length;
        }
        list.push({ value, next: null, highlighted: true });
      } else {
        list.splice(position, 0, { value, next: position + 1, highlighted: true });
        if (position > 0) {
          list[position - 1].next = position;
        }
        for (let i = position + 1; i < list.length; i++) {
          list[i].next = i < list.length - 1 ? i + 1 : null;
        }
      }

      yield {
        type: 'insert',
        structure: list.map((n, i) => ({ ...n, highlighted: i === position })),
        highlightedIndices: [position],
        message: `插入节点: ${value} 在位置 ${position}`,
      };

      list[position].highlighted = false;
    } else if (op.startsWith('delete')) {
      const position = parseInt(op.split(' ')[1]);
      if (position >= 0 && position < list.length) {
        list[position].highlighted = true;

        yield {
          type: 'delete',
          structure: [...list],
          highlightedIndices: [position],
          message: `删除节点: ${list[position].value} 在位置 ${position}`,
        };

        list.splice(position, 1);
        for (let i = 0; i < list.length; i++) {
          list[i].next = i < list.length - 1 ? i + 1 : null;
        }
      }
    } else if (op.startsWith('search')) {
      const value = parseInt(op.split(' ')[1]);
      for (let i = 0; i < list.length; i++) {
        list[i].highlighted = true;

        yield {
          type: 'search',
          structure: [...list],
          highlightedIndices: [i],
          message: `搜索节点: ${value}，当前位置: ${i}`,
        };

        if (list[i].value === value) {
          yield {
            type: 'search',
            structure: list.map((n, j) => ({ ...n, highlighted: j === i })),
            highlightedIndices: [i],
            message: `找到节点: ${value} 在位置 ${i}`,
          };
          list[i].highlighted = false;
          break;
        }

        list[i].highlighted = false;
      }
    }
  }

  yield {
    type: 'traverse',
    structure: list,
    highlightedIndices: [],
    message: '链表操作完成',
  };
}
