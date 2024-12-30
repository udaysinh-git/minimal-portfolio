---
layout: post.njk
title: Creating a Real-Time Hand-Tracking Drawing Application with Python
date: 2024-12-30
tags:
    - computer vision
    - python
    - OpenCV
    - MediaPipe
    - real-time applications
    - gesture control
    - tutorial
---

## Introduction

Welcome to **Finger-Funk**! In this blog post, we will build a real-time hand-tracking drawing application using Python, OpenCV, and MediaPipe. This application allows users to draw on the screen using hand gestures, change colors, adjust brush thickness, and erase drawings—all without touching the screen. By the end of this tutorial, you'll have a functional drawing tool that leverages computer vision for an interactive experience.

### 🎥 Demo

Check out this demo of **Finger-Funk** in action:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/PZiuoMNmJgk" style="position: absolute; top:0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
</div>

### 📂 GitHub Repository

You can find the complete source code for **Finger-Funk** on GitHub. Click the image below to visit the repository and get started:

[![Finger-Funk GitHub Repository](https://img.shields.io/badge/GitHub-Finger--Funk-blue?logo=github)](https://github.com/udaysinh-git/Finger-Funk)

## Finger-Funk: Your Hands, Your Canvas

**Finger-Funk** is a virtual canvas application that captures hand movements via your webcam to create digital art. Powered by OpenCV and MediaPipe, it transforms simple gestures into dynamic drawing actions.

### 🎨🖐️ Draw with Your Hands: A Gesture-Based Drawing App

This fun and interactive application allows you to draw on your screen using hand gestures detected by your webcam. Whether you're changing colors, adjusting brush thickness, or erasing drawings, Finger-Funk makes digital art intuitive and hands-free.

## Features

- **Hand Gesture Detection**: Uses MediaPipe to detect hand landmarks.
- **Drawing with Fingers**: Draw lines by bringing your thumb and index finger close together.
- **Color Selection**: Change drawing colors by hovering over color boxes.
- **Dynamic Thickness**: Adjust line thickness based on the number of fingers touching the thumb.
- **Erase Mode**: Erase parts of your drawing by spreading your thumb and pinky finger apart.
- **Clear Screen**: Clear the entire drawing by raising the middle finger on both hands.

## Prerequisites

Before we begin, ensure you have the following installed on your Windows machine:

- Python 3.x
- OpenCV
- MediaPipe

You can install the required libraries using pip:

```bash
pip install opencv-python mediapipe
```

## Installation

Clone the repository:

```bash
git clone https://github.com/udaysinh-git/finger-funk.git
cd finger-funk
```

Create a virtual environment and activate it:

```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows use `.venv\Scripts\activate`
```

Install the required packages:

```bash
pip install -r requirements.txt
```

## Usage

Run the Jupyter Notebook:

```bash
jupyter notebook main.ipynb
```

Follow the instructions in the notebook to start the application.

## Step-by-Step Guide

### Step 1: Import Libraries

First, let's import the necessary libraries for our application.

```python
import cv2
import mediapipe as mp
import time
```

### Step 2: Initialize MediaPipe and OpenCV

We'll initialize MediaPipe for hand tracking and set up OpenCV for video capture.

```python
# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_drawing = mp.solutions.drawing_utils

# Initialize OpenCV
cap = cv2.VideoCapture(0)
```

### Step 3: Set Up Drawing Settings

Define the initial settings for drawing, including colors, thickness, and other configurations.

```python
# Drawing settings
draw_color = (0, 255, 0)  # Green color for drawing
draw_thickness = 5
erase_thickness = 50  # Thickness of the eraser
drawing_points = []  # List to store drawing points

# Color options
colors = [(0, 255, 0), (0, 0, 255), (255, 0, 0), (255, 255, 0)]
color_index = 0

# Color selection box settings
color_box_size = 50
color_box_positions = [(10, 10), (70, 10), (130, 10), (190, 10)]

# Time tracking for clearing delay
clear_time = None
clear_delay = 5 

# Track previous points for drawing lines
prev_point = None
```

### Step 4: Define Helper Functions

We'll create a function to determine if the middle finger is up, which will be used to clear the drawings.

```python
def is_middle_finger_up(thumb_tip_coords, index_tip_coords, middle_tip_coords, ring_tip_coords, pinky_tip_coords):
    # Check if middle finger is up and other fingers are down
    return (middle_tip_coords[1] < index_tip_coords[1] and
            middle_tip_coords[1] < ring_tip_coords[1] and
            middle_tip_coords[1] < thumb_tip_coords[1] and
            middle_tip_coords[1] < pinky_tip_coords[1] and
            index_tip_coords[1] > thumb_tip_coords[1] and
            ring_tip_coords[1] > thumb_tip_coords[1] and
            pinky_tip_coords[1] > thumb_tip_coords[1])
```

### Step 5: Create a Resizable Window

Set up a named window that can be resized for better visibility.

```python
# Create a named window with the ability to resize
cv2.namedWindow('Hand Drawing App', cv2.WINDOW_NORMAL)
# Set the desired window size
cv2.resizeWindow('Hand Drawing App', 1366, 768)
```

### Step 6: Implement the Main Loop

The core of the application captures video frames, processes hand landmarks, and handles drawing based on user gestures.

```python
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip the frame horizontally for a selfie-view display
    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Draw color selection boxes
    for i, color in enumerate(colors):
        cv2.rectangle(frame, color_box_positions[i], 
                      (color_box_positions[i][0] + color_box_size, color_box_positions[i][1] + color_box_size), 
                      color, -1)

    # Process the frame and detect hands
    results = hands.process(frame_rgb)

    right_hand_middle_up = False
    left_hand_middle_up = False

    if results.multi_hand_landmarks:
        for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
            # Draw hand landmarks
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Get hand label (Left or Right)
            hand_label = handedness.classification[0].label

            # Get coordinates of finger tips
            thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
            index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
            middle_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
            ring_tip = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP]
            pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

            # Convert normalized coordinates to pixel coordinates
            h, w, _ = frame.shape
            thumb_tip_coords = (int(thumb_tip.x * w), int(thumb_tip.y * h))
            index_tip_coords = (int(index_tip.x * w), int(index_tip.y * h))
            middle_tip_coords = (int(middle_tip.x * w), int(middle_tip.y * h))
            ring_tip_coords = (int(ring_tip.x * w), int(ring_tip.y * h))
            pinky_tip_coords = (int(pinky_tip.x * w), int(pinky_tip.y * h))

            if hand_label == 'Right':
                # Check if thumb and index finger are close to each other
                distance_thumb_index = ((thumb_tip_coords[0] - index_tip_coords[0]) ** 2 + 
                                        (thumb_tip_coords[1] - index_tip_coords[1]) ** 2) ** 0.5
                if distance_thumb_index < 30 and (clear_time is None or time.time() - clear_time > clear_delay):
                    if prev_point is not None:
                        drawing_points.append((prev_point, index_tip_coords, draw_color, draw_thickness))
                    prev_point = index_tip_coords
                else:
                    prev_point = None

                # Check if index finger is over a color box
                for i, (x, y) in enumerate(color_box_positions):
                    if x < index_tip_coords[0] < x + color_box_size and y < index_tip_coords[1] < y + color_box_size:
                        draw_color = colors[i]

                # Adjust thickness based on the number of fingers touching the thumb
                touching_fingers = 0
                for tip_coords in [index_tip_coords, middle_tip_coords, ring_tip_coords, pinky_tip_coords]:
                    distance = ((thumb_tip_coords[0] - tip_coords[0]) ** 2 + 
                                (thumb_tip_coords[1] - tip_coords[1]) ** 2) ** 0.5
                    if distance < 30:
                        touching_fingers += 1

                draw_thickness = 5 + touching_fingers * 5

                # Check if middle finger is up
                if is_middle_finger_up(thumb_tip_coords, index_tip_coords, middle_tip_coords, ring_tip_coords, pinky_tip_coords):
                    right_hand_middle_up = True

            elif hand_label == 'Left':
                # Check if hand is wide open (thumb and pinky are far apart)
                distance_thumb_pinky = ((thumb_tip_coords[0] - pinky_tip_coords[0]) ** 2 + 
                                        (thumb_tip_coords[1] - pinky_tip_coords[1]) ** 2) ** 0.5
                if distance_thumb_pinky > 100:
                    # Erase points near the hand
                    margin = 10
                    drawing_points = [point for point in drawing_points if 
                                      ((point[0][0] - index_tip_coords[0]) ** 2 + 
                                       (point[0][1] - index_tip_coords[1]) ** 2) ** 0.5 > erase_thickness or
                                      point[0][0] < margin or point[0][0] > w - margin or 
                                      point[0][1] < margin or point[0][1] > h - margin]

                # Check if middle finger is up
                if is_middle_finger_up(thumb_tip_coords, index_tip_coords, middle_tip_coords, ring_tip_coords, pinky_tip_coords):
                    left_hand_middle_up = True

    # Clear all drawings if middle finger is up on both hands
    if right_hand_middle_up and left_hand_middle_up:
        drawing_points.clear()
        clear_time = time.time()  # Record the time when the drawing is cleared

    # Draw all lines in drawing_points
    for start_point, end_point, color, thickness in drawing_points:
        cv2.line(frame, start_point, end_point, color, thickness)

    cv2.imshow('Hand Drawing App', frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break
```

### Step 7: Release Resources

After exiting the main loop, release the video capture and close all OpenCV windows.

```python
cap.release()
cv2.destroyAllWindows()
```

## How It Works

- **Hand Detection**: The application uses MediaPipe to detect hand landmarks in real-time.
- **Drawing**: When the thumb and index finger are close together, the application starts drawing lines.
- **Color Selection**: Hover over the color boxes at the top left corner to change the drawing color.
- **Erase Mode**: Spread your thumb and pinky finger apart to erase parts of the drawing.
- **Clear Screen**: Raise the middle finger on both hands to clear the entire screen.

## Dependencies

- OpenCV
- MediaPipe
- NumPy

## Contributing

Feel free to fork this repository and contribute by submitting pull requests. Any improvements or new features are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/udaysinh-git/Finger-Funk/blob/main/LICENSE) file for details.

## References

- [MediaPipe Hands Documentation](https://google.github.io/mediapipe/solutions/hands.html)
- [OpenCV Documentation](https://opencv.org/)
- [MediaPipe GitHub Repository](https://github.com/google/mediapipe)
- [OpenCV GitHub Repository](https://github.com/opencv/opencv)

## Acknowledgements

- OpenCV
- MediaPipe

Enjoy drawing with your hands! 🎨🖐️
