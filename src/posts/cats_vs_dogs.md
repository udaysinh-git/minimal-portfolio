---
layout: post.njk
title: Building a Simple Cat vs Dog Classifier Using Python
date: 2024-12-27
tags:
    - machine learning
    - python
    - image classification
    - deep learning
    - neural networks
    - TensorFlow
    - Keras
    - AI
    - computer vision
    - tutorial
---
## Introduction

In this blog post, we will walk through the process of creating a simple artificial intelligence model that can differentiate between images of cats and dogs. We will use Python and some popular libraries to achieve this. By the end of this tutorial, you will have a basic understanding of how to build and train a machine learning model for image classification.

## Prerequisites

Before we start, make sure you have the following installed:

- Python 3.x
- TensorFlow
- Keras
- NumPy
- Matplotlib
- Requests

You can install these libraries using pip:

```bash
pip install tensorflow keras numpy matplotlib requests
```

## Step 1: Import Libraries

First, let's import the necessary libraries.

```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
import numpy as np
import matplotlib.pyplot as plt
import requests
from PIL import Image
from io import BytesIO
```

## Step 2: Load and Preprocess Data

For this tutorial, we will use images from two APIs: [The Cat API](https://api.thecatapi.com/v1/images/search) for cat images and [Dog CEO&#39;s Dog API](https://dog.ceo/api/breeds/image/random) for dog images.

### Fetching Cat Images

```python
cat_url = "https://api.thecatapi.com/v1/images/search"
response = requests.get(cat_url)
cat_data = response.json()
cat_image_url = cat_data[0]['url']

response = requests.get(cat_image_url)
cat_img = Image.open(BytesIO(response.content))
cat_img = cat_img.resize((128, 128))
cat_img = np.array(cat_img)
```

### Fetching Dog Images

```python
dog_url = "https://dog.ceo/api/breeds/image/random"
response = requests.get(dog_url)
dog_data = response.json()
dog_image_url = dog_data['message']

response = requests.get(dog_image_url)
dog_img = Image.open(BytesIO(response.content))
dog_img = dog_img.resize((128, 128))
dog_img = np.array(dog_img)
```

### Displaying the Images

```python
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.title("Cat")
plt.imshow(cat_img)

plt.subplot(1, 2, 2)
plt.title("Dog")
plt.imshow(dog_img)

plt.show()
```

![Cat Image](https://cdn2.thecatapi.com/images/MTY5OTE4Nw.jpg)
![Dog Image](https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg)

## Step 3: Build the Model

We will use a simple Convolutional Neural Network (CNN) for our classifier.

```python
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(2, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
```

## Step 4: Train the Model

For simplicity, we will use the same images for training. In a real-world scenario, you should use a larger dataset.

```python
X = np.array([cat_img, dog_img])
y = np.array([0, 1])  # 0 for cat, 1 for dog

model.fit(X, y, epochs=10)
```

## Step 5: Evaluate the Model

Let's test our model with a new image.

```python
test_url = "https://api.thecatapi.com/v1/images/search"
response = requests.get(test_url)
test_data = response.json()
test_image_url = test_data[0]['url']

response = requests.get(test_image_url)
test_img = Image.open(BytesIO(response.content))
test_img = test_img.resize((128, 128))
test_img = np.array(test_img)

prediction = model.predict(np.expand_dims(test_img, axis=0))
predicted_class = np.argmax(prediction)

if predicted_class == 0:
    print("It's a cat!")
else:
    print("It's a dog!")
```

## Conclusion

In this tutorial, we built a simple image classifier that can differentiate between cats and dogs using Python and TensorFlow. While this is a basic example, it provides a foundation for more complex image classification tasks. Happy coding!

## References

- [The Cat API](https://api.thecatapi.com/v1/images/search)
- [Dog CEO&#39;s Dog API](https://dog.ceo/api/breeds/image/random)
- [TensorFlow Documentation](https://www.tensorflow.org/)
