extends Node3D

@export var move_speed := 18.0
@export var zoom_speed := 1.5
@export var min_zoom := 12.0
@export var max_zoom := 32.0
@export var drag_sensitivity := 0.035

var camera: Camera3D
var zoom := 22.0
var dragging := false
var last_pointer := Vector2.ZERO

func _ready() -> void:
	camera = Camera3D.new()
	camera.position = Vector3(0, zoom, zoom * 0.72)
	camera.rotation_degrees = Vector3(-48, 0, 0)
	camera.current = true
	add_child(camera)
	_update_camera()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenDrag:
		global_position.x -= event.relative.x * drag_sensitivity
		global_position.z -= event.relative.y * drag_sensitivity
	elif event is InputEventMouseMotion and Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT):
		global_position.x -= event.relative.x * drag_sensitivity
		global_position.z -= event.relative.y * drag_sensitivity
	elif event is InputEventMagnifyGesture:
		zoom = clampf(zoom / event.factor, min_zoom, max_zoom)
		_update_camera()
	elif event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP:
			zoom = clampf(zoom - zoom_speed, min_zoom, max_zoom)
			_update_camera()
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			zoom = clampf(zoom + zoom_speed, min_zoom, max_zoom)
			_update_camera()

func _update_camera() -> void:
	if camera == null:
		return
	camera.position = Vector3(0, zoom, zoom * 0.72)
