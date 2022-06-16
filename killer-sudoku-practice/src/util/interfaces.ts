/**
 * Supports cloning, which creates a new instance of a class with the same value as an existing instance.
 */
export interface ICloneable<T> {
    /**
     * Creates a new object that is a copy of the current instance.
     * @returns {T} A new object that is a copy of this instance.
     */
    clone(): T;
}

/**
 * Defines a generalized type-specific comparison method that a value type or class implements to order or sort its instances.
 */
export interface IComparable<T> {
    /**
     * Compares the current instance with another object of the same type and returns a number
     * that indicates whether the current instance precedes, follows, or occurs in the same position in the sort order as the other object.
     * @param {T} obj An object to compare with this instance.
     * @returns {number} A value that indicates the relative order of the objects being compared. The return value has these meanings:
     * - Less than zero	This instance precedes obj in the sort order.
     * - Zero This instance occurs in the same position in the sort order as obj.
     * - Greater than zero This instance follows obj in the sort order.
     */
    compareTo(obj: T): number;
}

/**
 * Exposes a method that compares two objects.
 */
export interface IComparer<T> {
    /**
     * @description
     * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
     * @param {T} x The first object to compare.
     * @param {T} y The second object to compare.
     * @returns {number} A signed number that indicates the relative values of x and y:
        - If less than 0, x is less than y.
        - If 0, x equals y.
        - If greater than 0, x is greater than y.
     */
    compare(x: T, y: T): number;
}

/**
 * Indicates that a class can be serialized. This class cannot be inherited.
 */
 export interface ISerializable<T> {
    /**
     * Converts a JSON-formatted string to an object of the specified type.
     * @param input a JSON-formatted string
     * @returns {T} A new object that is a copy of this instance.
     */
    deserialize(input: string): T;

    /**
     * Converts the current instance to a JSON-formatted string.
     * @returns {string} A serialized string of the current instance.
     */
    serialize(): string;
}

/**
 * Defines methods to manipulate generic collections.
 */
export interface IColleciton<T> {
    /**
     * Gets the number of elements contained in the ICollection<T>.
     * @returns {number} The number of elements contained in the ICollection<T>.
     */
    get size(): number;

    /**
     * Appends value to the Set object.
     * @param {T} value The value of the element to add to the Set object.
     */
    add(value: T): void;

    /**
     * Removes all elements from the Set object.
     */
    clear(): void;

    /**
     * Removes the element associated to the value and returns a boolean asserting whether an element was successfully removed or not.
     * @param {T} value The value to remove from Set.
     * @returns {boolean} Returns true if value was already in Set; otherwise false.
     */
    delete(value: T): boolean;

    /**
     * Returns a boolean asserting whether an element is present with the given value in the Set object or not.
     * @param {T} value The value to test for presence in the Set object.
     * @returns {boolean} Returns true if an element with the specified value exists in the Set object; otherwise false.
     */
    has(value: T): boolean;
}

/**
 * Provides the base interface for the abstraction of sets.
 */
export interface ISet<T> {
    /**
     * Returns the new Set that contains only elements that are in both collection.
     * @param x The collection to compare.
     * @param y The collection to compare.
     * @returns {T} The Set object that contains only elements that are in both collection.
     */
    and(x: T, y: T): T;
    /**
     * Modifies the current set so that it contains only elements that are also in a specified collection.
     * @param other The collection to compare to the current set.
     */
    intersectWith(other: T): void;
    /**
     * Returns the new Set that contains all elements that are in x, in y or in both.
     * @param x The collection to compare.
     * @param y The collection to compare.
     * @returns {T} The Set object that contains all elements that are in x, in y or in both.
     */
    or(x: T, y: T): T;
    /**
     * Modifies the current set so that it contains all elements that are present in the current set, in the specified collection, or in both.
     * @param other The collection to compare to the current set.
     */
    unionWith(other: T): void;
}