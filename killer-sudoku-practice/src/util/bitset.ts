import { ICloneable, IColleciton, IComparable, ISet } from "./interfaces";

export type BitSetOrNumber = BitSet | number;

/**
 * Bitset for Sudoku
 */
export class BitSet implements ICloneable<BitSet>, IComparable<BitSet>, IColleciton<number>, ISet<BitSet> {
    data: number;
    /**
     * Start index. For Sudoku, index starts from 1.
     */
    start = 1;

    constructor(data?: number | BitSet) {
        this.data = 0

        if (data === undefined) {
            this.data = 0
        }
        else if (typeof data === "number") {
            this.data = data
        }
        else if (data instanceof BitSet) {
            this.data = data.data
        }
        else {
            throw new TypeError(`value type is not number or BitSet ${typeof data}`)
        }
    }

    /**
     * @see ICloneable
     * Creates a new object that is a copy of the current instance.
     * @returns {BitSet} A new object that is a copy of this instance.
     */
    clone() {
        return new BitSet(this.data)
    }

    /**
     * @see IComparer
     * @summary
     * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
     * @description
     * At first, compare popcount of both value.
     * If they are different, the function returns comparison result of popcount.
     * If they are equal, compare member of bitset.
     * 
     * a = b'001001' = [1, 4], b = b'010000' = [5] => a > b (function returns postive value)
     * a = b'001001' = [1, 4], b = b'010001' = [1, 5] => a < b (function returns negative value)
     * @example
     *   compare(b'001001', b'010000') => positive value
     *   compare(b'001001', b'010001') => negative value
     * @param {Bitset} x A bitset object
     * @param {Bitset} y A bitset object
     * @returns 0 if a = b, negative value if a < b, positive value if a > b
     */

    /**
     * @summary
     * Compares the current instance with another object of the same type and returns a number
     * that indicates whether the current instance precedes, follows, or occurs in the same position in the sort order as the other object.
     * @description
     * At first, compare size (=popcount) of both BitSet.
     * If they are different, the function returns comparison result of size.
     * If they are equal, compare member of BitSet.
     * 
     * a = b'001001' = [1, 4], b = b'010000' = [5] => a > b (function returns postive value)
     * a = b'001001' = [1, 4], b = b'010001' = [1, 5] => a < b (function returns negative value)
     * @example
     *   BitSet(b'001001').compareTo(BitSet(b'010000')) => positive value
     *   BitSet(b'001001').compareTo(BitSet(b'010001')) => negative value
     * @param {BitSet} obj An object to compare with this instance.
     * @returns 0 if a = b, negative value if a < b, positive value if a > b
     */
    compareTo(obj: BitSet): number {
        const bitSetX = this
        const bitSetY = new BitSet(obj)

        if (bitSetX.data === bitSetY.data) {
            return 0
        }
        const popcntX = this.size
        const popcntY = bitSetY.size
        // If popcount is different, return popcount(x) - popcount(x)
        if (popcntX !== popcntY) {
            return popcntX - popcntY
        }
        // If popcount is equal, get first different members
        const diffBit = bitSetX.data ^ bitSetY.data
        const diffLSB = diffBit & -diffBit
        // If first different members is in x, x is smaller than y
        return (bitSetX.data & diffLSB) !== 0 ? -1 : 1;
    }

    /**
     * @see IColleciton
     */
    get size(): number {
        return BitSet.popCount(this);
    }

    /**
     * @see IColleciton
     * @param value 
     */
    add(value: number): void {
        value -= this.start;
        this.data |= 1 << value;
    }

    /**
     * @see IColleciton
     */
    clear(): void {
        this.data = 0;
    }

    /**
     * @see IColleciton
     * @param value 
     * @returns 
     */
    delete(value: number): boolean {
        value -= this.start;
        const ret = this.has(value);
        this.data &= ~(1 << value)
        return ret;
    }

    /**
     * @see IColleciton
     * @param value 
     * @returns 
     */
    has(value: number): boolean {
        value -= this.start;
        return (this.data & (1 << value)) !== 0
    }

    /**
     * @param value 
     * @returns 
     */
     deleteAll(values: BitSet): boolean {
        const bef_size = this.size
        this.data &= ~values.data;
        const ret = this.size !== bef_size;
        return ret;
    }

    /**
     * @see ISet
     * @param x 
     * @param y 
     * @returns 
     */
    and(x: BitSet, y: BitSet): BitSet {
        return new BitSet(x.data & y.data);
    }

    /**
     * @see ISet
     * @param other 
     */
    intersectWith(other: BitSet): void {
        this.data &= other.data
    }

    /**
     * @see ISet
     * @param other 
     */
    unionWith(other: BitSet): void {
        this.data |= other.data
    }

    /**
     * @see ISet
     * @param x 
     * @param y 
     * @returns 
     */
    or(x: BitSet, y: BitSet): BitSet {
        return new BitSet(x.data | y.data);
    }   

    toArray(): Array<number> {
        let ret = [];
        let v = this.data;

        while (v !== 0) {
            let t = 31 - Math.clz32(v);
            v ^= 1 << t;
            ret.unshift(t + this.start);
        }

        return ret;
    }

    sum(): number {
        let ret = 0;
        let v = this.data;

        while (v !== 0) {
            let t = 31 - Math.clz32(v);
            v ^= 1 << t;
            ret += t + this.start
        }
        return ret;
    }

    /**
     * Count bits
     * @see {@link https://graphics.stanford.edu/~seander/bithacks.html Bit Twiddling Hacks By Sean Eron Anderson}
     * @param value BitSet or number to count bits
     * @returns Number of 1 bits
     */
    public static popCount(value: BitSet | number): number {
        let v = new BitSet(value).data
        v = v - ((v >> 1) & 0x55555555);
        v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
        return (((v + (v >> 4)) & 0xF0F0F0F) * 0x1010101) >> 24;
    }

    /**
    * Set a single bit flag
    *
    * Ex:
    * bs1 = new BitSet(10);
    *
    * bs1.set(3, 1);
    *
    * @param {number} index The index of the bit to be set
    * @param {number=} value Optional value that should be set on the index (0, false or 1, true)
    * @returns {BitSet} this
    */
    public set(index: number, value?: boolean | number): BitSet {
        index -= this.start;

        if (value === undefined || value) {
            this.data |= (1 << index);
        } else {
            this.data &= ~(1 << index);
        }
        return this;
    }

    /**
     * Fill all bits as 1
     * @param size bit length
     */
    public fill(size: number) {
        this.data |= (1 << size) - 1;
    }
}


/**
 * Manage BitSet Array
 */
export class BitSetArray extends Array<BitSet> {

    public static generateCombinations(size: number): BitSetArray {
        const maxValue = 1 << size;
        let ret = new BitSetArray()
        for (let i=0; i < maxValue; i++) {
            ret.push(new BitSet(i))
        }
        return ret;
    }

    public intersection() {
        /**
         * If array is empty, return empty bitset
         */
        if (this.length === 0) {
            return new BitSet()
        }

        let ret = new BitSet(this[0])
        this.forEach(v => ret.intersectWith(v))
        return ret
    }

    public union() {
        let ret = new BitSet()
        this.forEach(v => ret.unionWith(v))
        // console.log("union", this, ret)
        return ret
    }

    public sort(compareFn?: (a: BitSet, b: BitSet) => number): this {
        let defaultCompareFn = (a: BitSet, b: BitSet) => a.compareTo(b)
        compareFn = compareFn ?? defaultCompareFn;
        super.sort(compareFn);
        return this;
    }
}