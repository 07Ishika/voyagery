/**
 * Base repository — Single Responsibility: data access only.
 * All domain repositories extend this (Open/Closed).
 */
class BaseRepository {
  /**
   * @param {string} collectionKey - key on config/db collections map
   */
  constructor(collectionKey) {
    this.collectionKey = collectionKey;
  }

  get collection() {
    const { collections } = require('../config/db');
    const col = collections[this.collectionKey];
    if (!col) {
      throw new Error(`Collection "${this.collectionKey}" is not initialized. Is DB connected?`);
    }
    return col;
  }

  find(query = {}, options = {}) {
    let cursor = this.collection.find(query);
    if (options.sort) cursor = cursor.sort(options.sort);
    if (options.limit) cursor = cursor.limit(options.limit);
    if (options.skip) cursor = cursor.skip(options.skip);
    return cursor.toArray();
  }

  findOne(query) {
    return this.collection.findOne(query);
  }

  insertOne(doc) {
    return this.collection.insertOne(doc);
  }

  updateOne(query, update, options = {}) {
    return this.collection.updateOne(query, update, options);
  }

  deleteOne(query) {
    return this.collection.deleteOne(query);
  }

  countDocuments(query = {}) {
    return this.collection.countDocuments(query);
  }

  distinct(field, query = {}) {
    return this.collection.distinct(field, query);
  }
}

module.exports = { BaseRepository };
