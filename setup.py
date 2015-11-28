from distutils.core import setup

setup(
  name='facemorpher',
  version='1.0.1',
  author='Alyssa Quek',
  author_email='alyssaquek@gmail.com',
  description=('Warp, morph and average human faces!'),
  packages=['facemorpher'],
  package_data={'facemorpher': ['data/*.xml', 'bin/stasm_util']},
  data_files=[('readme', ['README.rst'])],
  keywords='face morphing, averaging, warping',
  url='https://github.com/alyssaq/face_morpher',
  long_description=open('README.rst').read(),
  license='MIT',
)
