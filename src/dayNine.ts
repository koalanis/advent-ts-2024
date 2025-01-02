import { getAdventContext } from "./utils.ts";

function fromDiskMapToSpace(diskMap: string): string[] {
  let out = [];

  for (let i = 0; i < diskMap.length; i++) {
    const at = Number(diskMap[i]);
    let toAppend = ".";
    if (i % 2 == 0) {
      toAppend = String(i / 2);
    }
    for (let j = 0; j < at; j++) {
      out.push(toAppend);
    }
  }
  return out;
}

type Interval = [number, number];

type DiskAnalysis = {
  data: Interval[];
  freeSpace: Interval[];
};

function fromDiskMapToDataIntervals(diskMap: string): DiskAnalysis {
  let data: Interval[] = [];
  let freeSpace: Interval[] = [];
  let offset = 0;
  for (let i = 0; i < diskMap.length; i++) {
    const at = Number(diskMap[i]);
    if (i % 2 == 0) {
      data.push([offset, offset + at]);
    } else {
      freeSpace.push([offset, offset + at]);
    }
    offset += at;
  }
  return { data, freeSpace };
}

function size(i: Interval): number {
  return i[1] - i[0];
}

function defragDiskSpace(disk: string[]): void {
  let i = 0;
  let j = disk.length - 1;
  while (i < disk.length && i < j) {
    while (i < disk.length && disk[i] !== ".") i++;
    while (j > 0 && disk[j] === ".") j--;
    if (i >= j) return;
    let temp = disk[i];
    disk[i] = disk[j];
    disk[j] = temp;
  }
}

function defragDiskSpaceTwo(disk: string[], intervals: DiskAnalysis): void {
  // get list of free ranges
  // get list of file ranges

  // starting at files at the end of the disk space, move them to the left most space of free space
  // when doing this, make sure to update the list of free ranges to be accurate after change
  for (let i = intervals.data.length - 1; i >= 0; i--) {
    const fileId = i;
    const fileLocation = intervals.data[i];
    const fileSize = size(fileLocation);

    if (fileSize == 0) continue;
    // find freespace for it that is to its left
    let freeSpaceIdx = -1;
    for (let j = 0; j < intervals.freeSpace.length; j++) {
      const candidate = intervals.freeSpace[j];
      if (size(candidate) >= fileSize) {
        freeSpaceIdx = j;
        break;
      }
      if (candidate[0] > fileLocation[0]) break;
    }

    if (0 <= freeSpaceIdx && freeSpaceIdx < intervals.freeSpace.length) {
      // found a freespace to move data in
      // do write to disk
      const freeSpace = intervals.freeSpace[freeSpaceIdx];
      for (let k = 0; k < fileSize; k++) {
        disk[freeSpace[0] + k] = String(fileId);
      }
      for (let k = 0; k < fileSize; k++) {
        disk[fileLocation[0] + k] = ".";
      }
      // update freespace list
      intervals.freeSpace[freeSpaceIdx][0] += fileSize;
    }
  }
}

function checksumOfData(disk: string[]): number {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) {
    const at = disk[i];
    if (disk[i] !== ".") {
      sum += i * Number(disk[i]);
    }
  }
  return sum;
}

export async function dayNine() {
  const ADVENT = getAdventContext({ day: 9, year: 2024, debug: true });
  const data = await ADVENT.getDataFile();
  const disk = fromDiskMapToSpace(data);
  const disk2 = Array.from(disk);
  const intervalMap = fromDiskMapToDataIntervals(data);

  defragDiskSpace(disk);
  ADVENT.reportPartOne(checksumOfData(disk));

  defragDiskSpaceTwo(disk2, intervalMap);
  ADVENT.reportPartTwo(checksumOfData(disk2));
}
