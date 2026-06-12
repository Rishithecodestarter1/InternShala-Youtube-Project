// videoController.js - Handles video search, upload, update, deletion, and like/dislike toggles.
import Channel from '../models/Channel.js'
import Video from '../models/Video.js'

const editableVideoFields = ['title', 'description', 'thumbnailUrl', 'videoUrl', 'category']

function normalizeVideoFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
  )
}

function buildVideoQuery({ search, category }) {
  const query = {}
  const normalizedSearch = search?.trim()
  const normalizedCategory = category?.trim()

  if (normalizedSearch) {
    query.$or = [
      { title: { $regex: normalizedSearch, $options: 'i' } },
      { channelName: { $regex: normalizedSearch, $options: 'i' } },
      { category: { $regex: normalizedSearch, $options: 'i' } },
    ]
  }

  if (normalizedCategory && normalizedCategory !== 'All') {
    query.category = normalizedCategory
  }

  return query
}

export async function getVideos(request, response, next) {
  try {
    const query = buildVideoQuery(request.query)
    const page = Number.parseInt(request.query.page, 10)
    const limit = Number.parseInt(request.query.limit, 10)

    if (Number.isInteger(page) && page > 0 && Number.isInteger(limit) && limit > 0) {
      const skip = (page - 1) * limit
      const [videos, total] = await Promise.all([
        Video.find(query).sort({ uploadDate: -1 }).skip(skip).limit(limit),
        Video.countDocuments(query),
      ])

      return response.status(200).json({
        videos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    }

    const videos = await Video.find(query).sort({ uploadDate: -1 })
    return response.status(200).json(videos)
  } catch (error) {
    return next(error)
  }
}

export async function getVideoById(request, response, next) {
  try {
    const video = await Video.findByIdAndUpdate(request.params.id, { $inc: { views: 1 } }, { new: true })

    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    return response.status(200).json(video)
  } catch (error) {
    return next(error)
  }
}

export async function createVideo(request, response, next) {
  try {
    const { title, thumbnailUrl, videoUrl, description = '', category, channelId } = normalizeVideoFields(request.body)

    if (!title || !thumbnailUrl || !videoUrl || !category || !channelId) {
      return response.status(400).json({ message: 'Title, thumbnail, video URL, category, and channel are required.' })
    }

    const channel = await Channel.findById(channelId)
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found.' })
    }

    if (channel.owner !== request.user.id) {
      return response.status(403).json({ message: 'Only the channel owner can upload videos.' })
    }

    const video = await Video.create({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId: channel._id.toString(),
      channelName: channel.channelName,
      uploader: request.user.id,
    })

    await Channel.findByIdAndUpdate(channel._id, { $addToSet: { videos: video._id.toString() } })

    return response.status(201).json(video)
  } catch (error) {
    return next(error)
  }
}

export async function updateVideo(request, response, next) {
  try {
    const video = await Video.findById(request.params.id)

    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    if (video.uploader !== request.user.id) {
      return response.status(403).json({ message: 'Only the owner can edit this video.' })
    }

    editableVideoFields.forEach((field) => {
      if (request.body[field] !== undefined) {
        video[field] = typeof request.body[field] === 'string' ? request.body[field].trim() : request.body[field]
      }
    })

    if (!video.title || !video.thumbnailUrl || !video.videoUrl || !video.category) {
      return response.status(400).json({ message: 'Title, thumbnail, video URL, and category cannot be blank.' })
    }

    const updatedVideo = await video.save()
    return response.status(200).json(updatedVideo)
  } catch (error) {
    return next(error)
  }
}

export async function deleteVideo(request, response, next) {
  try {
    const video = await Video.findById(request.params.id)

    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    if (video.uploader !== request.user.id) {
      return response.status(403).json({ message: 'Only the owner can delete this video.' })
    }

    await Video.findByIdAndDelete(video._id)
    await Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: video._id.toString() } })

    return response.status(200).json({ message: 'Video deleted successfully.' })
  } catch (error) {
    return next(error)
  }
}

export async function toggleLike(request, response, next) {
  try {
    const video = await Video.findById(request.params.id)

    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    const userId = request.user.id
    // Toggle-style like: clicking again unlikes, and switching removes a dislike.
    video.dislikes = video.dislikes.filter((id) => id !== userId)
    video.likes = video.likes.includes(userId)
      ? video.likes.filter((id) => id !== userId)
      : [...video.likes, userId]

    const updatedVideo = await video.save()
    return response.status(200).json(updatedVideo)
  } catch (error) {
    return next(error)
  }
}

export async function toggleDislike(request, response, next) {
  try {
    const video = await Video.findById(request.params.id)

    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    const userId = request.user.id
    video.likes = video.likes.filter((id) => id !== userId)
    video.dislikes = video.dislikes.includes(userId)
      ? video.dislikes.filter((id) => id !== userId)
      : [...video.dislikes, userId]

    const updatedVideo = await video.save()
    return response.status(200).json(updatedVideo)
  } catch (error) {
    return next(error)
  }
}
