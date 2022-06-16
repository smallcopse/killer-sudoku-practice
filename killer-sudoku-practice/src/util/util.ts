
/**
 * Python-like range function
 * @example
 *   range(3) => [0, 1, 2]
 *   range(1, 5) => [1, 2, 3, 4]
 *   range(1, 10, 2) => [1, 3, 5, 7, 9]
 * @param start start of range
 * @param end end of range (exclude this number)
 * @param step increment step
 * @returns Array of numbers
 */
export function range(
    start: number, end?: number, step?: number): number[] {

    // if only 1 argument is specified (end is undefined), set (_start, _end) = (0, start)
    // otherwise, set (_start, _end) = (start, end)
    const _start: number = end === undefined ? 0 : start
    const _end: number = end ?? start
    // if step is unspecified, set step = 1
    const _step: number = step ?? 1

    return Array.from(
        { length: (((_end - _start - 1) / _step | 0) + 1) },
        (v, k) => k * _step + _start
    );
}

/**
 * shuffle an array
 * (配列の中身をシャッフルする)
 * @param array: shuffle
 * @returns shuffled array
 */
export function shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function sumArray(array: number[]): number {
    return array.reduce(
        function (sum, element) {
            return sum + element;
        },
        0);
}

// export function* zip(...iterables: any[]) {
//     const iterators = iterables.map(it => it[Symbol.iterator]());
//     while (iterators.length) {
//         const result = [];
//         for (const it of iterators) {
//             const elemObj = it.next();
//             if (elemObj.done) {
//                 return;
//             }
//             result.push(elemObj.value);
//         }
//         yield result;
//     }
// }

export function zip(...arrays: Array<Array<any>>) {
    const length = Math.min(...(arrays.map(arr => arr.length)))
    return new Array(length).fill(null).map((_, i) => arrays.map(arr => arr[i]))
}

/**
 * Method for counting bits in a 32-bit integer n
 * @param n 32-bit integer
 * @returns bit count result
 * @see {@link https://graphics.stanford.edu/~seander/bithacks.html Bit Twiddling Hacks}
 */
export function popCount(n: number) {
    // https://graphics.stanford.edu/~seander/bithacks.html
    n = n - ((n >> 1) & 0x55555555);                    // reuse input as temporary
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);     // temp
    return (((n + (n >> 4)) & 0xF0F0F0F) * 0x1010101) >> 24; // count
}

/**
 * Concatenate string horizontally
 * 
 * @example
 * strs = ["a\nb\nc", "d\ne\nf"]
 * concatStringHorizontally(strs) => ["ad", "be", cf"]
 * @param strs 
 * @param delimiter 
 * @returns 
 */
export function concatStringHorizontally(strs: string[], delimiter: string = ""): string[] {
    let lines = zip(...(strs.map(str => str.split("\n")))).map(
        linezip => linezip.join(delimiter)
    )
    return lines;
}