"""
Create a video with image frames
"""

import cv2
import numpy as np

def check_write_video(func):
  def inner(self, *args, **kwargs):
    if self.video:
      return func(self, *args, **kwargs)
    else:
      pass
  return inner


class Video(object):
  def __init__(self, filename, fps, w, h):
    self.filename = filename
    self.counter = 0

    if filename is None:
      self.video = None
    else:
      fourcc = cv2.cv.FOURCC('m', 'p', '4', 'v')
      self.video = cv2.VideoWriter(filename, fourcc, fps, (w, h), True)

  @check_write_video
  def write(self, img, num_times=1):
    frame = np.copy(img)
    if img.shape[2] == 3:
      #  OpenCV channels are gbr so we need to swap scipy's rgb chs
      frame[..., 0], frame[..., 2] = img[..., 2], img[..., 0]

    for i in xrange(num_times):
      self.video.write(frame)
      self.counter += 1

  @check_write_video
  def end(self):
    print self.filename, 'saved'
    self.video.release()
