// channelController.js - Creates channels and returns channel details plus channel video lists.
import Channel from '../models/Channel.js'
import User from '../models/User.js'
import Video from '../models/Video.js'

export async function createChannel(request, response, next) {
  try {
    const { channelName, description = '', channelBanner = '' } = request.body

    if (!channelName || !channelName.trim()) {
      return response.status(400).json({ message: 'Channel name is required.' })
    }

    const existingChannel = await Channel.findOne({ channelName: channelName.trim() })
    if (existingChannel) {
      return response.status(400).json({ message: 'Channel name already exists.' })
    }

    const channel = await Channel.create({
      channelName: channelName.trim(),
      owner: request.user.id,
      description: description.trim(),
      channelBanner,
    })

    await User.findByIdAndUpdate(request.user.id, { $addToSet: { channels: channel._id.toString() } })

    return response.status(201).json(channel)
  } catch (error) {
    return next(error)
  }
}

export async function getChannel(request, response, next) {
  try {
    const channel = await Channel.findById(request.params.id)

    if (!channel) {
      return response.status(404).json({ message: 'Channel not found.' })
    }

    return response.status(200).json(channel)
  } catch (error) {
    return next(error)
  }
}

export async function updateChannel(request, response, next) {
  try {
    const channel = await Channel.findById(request.params.id)

    if (!channel) {
      return response.status(404).json({ message: 'Channel not found.' })
    }

    if (channel.owner !== request.user.id) {
      return response.status(403).json({ message: 'Only the channel owner can update this channel.' })
    }

    const { channelName, description, channelBanner } = request.body

    if (channelName !== undefined) {
      const normalizedName = channelName.trim()
      if (!normalizedName) return response.status(400).json({ message: 'Channel name is required.' })

      const existingChannel = await Channel.findOne({ channelName: normalizedName, _id: { $ne: channel._id } })
      if (existingChannel) return response.status(400).json({ message: 'Channel name already exists.' })

      channel.channelName = normalizedName
    }

    if (description !== undefined) channel.description = description.trim()
    if (channelBanner !== undefined) channel.channelBanner = channelBanner.trim()

    const updatedChannel = await channel.save()
    return response.status(200).json(updatedChannel)
  } catch (error) {
    return next(error)
  }
}

export async function getChannelVideos(request, response, next) {
  try {
    const videos = await Video.find({ channelId: request.params.id }).sort({ uploadDate: -1 })
    return response.status(200).json(videos)
  } catch (error) {
    return next(error)
  }
}
