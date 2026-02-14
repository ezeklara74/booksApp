import { Post } from '../db/models/post.js'

export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const order =
    sortOrder === 'ascending' || sortOrder === 'asc' || sortOrder === 1 ? 1 : -1
  return await Post.find(query).sort({ [sortBy]: order })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

export async function listPostsByTag(tag, options) {
  return await listPosts({ tags: tag }, options)
}

export async function getPostById(postId) {
  return await Post.findByIdAndDelete(postId)
}

export async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
