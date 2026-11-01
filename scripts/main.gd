extends Node3D

const UnitScript = preload("res://scripts/unit.gd")
const CameraScript = preload("res://scripts/rts_camera.gd")

var selected_units: Array[Node3D] = []
var units: Array[Node3D] = []
var ground_plane: StaticBody3D
var camera_rig: Node3D
var status_label: Label
var selection_box: MeshInstance3D

func _ready() -> void:
	_build_world()
	_build_camera()
	_build_hud()
	_spawn_demo_units()

func _build_world() -> void:
	var world_env := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color(0.09, 0.12, 0.15)
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color(0.72, 0.78, 0.85)
	environment.ambient_light_energy = 0.8
	world_env.environment = environment
	add_child(world_env)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-55, -35, 0)
	sun.light_energy = 1.25
	add_child(sun)

	ground_plane = StaticBody3D.new()
	ground_plane.name = "Ground"
	var floor_mesh := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(50, 50)
	floor_mesh.mesh = plane
	var floor_material := StandardMaterial3D.new()
	floor_material.albedo_color = Color(0.22, 0.31, 0.25)
	floor_mesh.material_override = floor_material
	ground_plane.add_child(floor_mesh)
	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(50, 0.2, 50)
	collision.shape = shape
	collision.position.y = -0.1
	ground_plane.add_child(collision)
	add_child(ground_plane)

func _build_camera() -> void:
	camera_rig = Node3D.new()
	camera_rig.set_script(CameraScript)
	add_child(camera_rig)

func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	var panel := PanelContainer.new()
	panel.position = Vector2(18, 18)
	panel.custom_minimum_size = Vector2(300, 76)
	layer.add_child(panel)
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 14)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 14)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)
	var column := VBoxContainer.new()
	margin.add_child(column)
	var title := Label.new()
	title.text = "THËALEM RTS  •  PROTOTYPE"
	title.add_theme_font_size_override("font_size", 18)
	column.add_child(title)
	status_label = Label.new()
	status_label.text = "Touchez une unité pour la sélectionner."
	column.add_child(status_label)

func _spawn_demo_units() -> void:
	for i in range(5):
		var unit := Node3D.new()
		unit.set_script(UnitScript)
		unit.position = Vector3(-5.0 + float(i) * 2.2, 0.0, 1.5)
		unit.set_meta("unit_name", "Garde de Valdoria %d" % (i + 1))
		add_child(unit)
		units.append(unit)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch and event.pressed:
		_handle_world_tap(event.position)
	elif event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			_handle_world_tap(event.position)

func _handle_world_tap(screen_position: Vector2) -> void:
	var camera := get_viewport().get_camera_3d()
	if camera == null:
		return
	var origin := camera.project_ray_origin(screen_position)
	var direction := camera.project_ray_normal(screen_position)
	var query := PhysicsRayQueryParameters3D.create(origin, origin + direction * 300.0)
	query.collide_with_areas = true
	var hit := get_world_3d().direct_space_state.intersect_ray(query)
	if hit.is_empty():
		return
	var collider: Object = hit.get("collider")
	var clicked_unit: Node3D
	if collider is Node:
		var node := collider as Node
		while node != null:
			if node in units:
				clicked_unit = node as Node3D
				break
			node = node.get_parent()
	if clicked_unit != null:
		_select_unit(clicked_unit)
	else:
		_move_selected_to(hit.position)

func _select_unit(unit: Node3D) -> void:
	for old_unit in selected_units:
		if is_instance_valid(old_unit):
			old_unit.call("set_selected", false)
	selected_units.clear()
	selected_units.append(unit)
	unit.call("set_selected", true)
	status_label.text = str(unit.get_meta("unit_name", "Unité sélectionnée"))

func _move_selected_to(target: Vector3) -> void:
	if selected_units.is_empty():
		return
	var spacing := 1.4
	for i in range(selected_units.size()):
		var offset := Vector3(float(i % 3) * spacing, 0, float(i / 3) * spacing)
		selected_units[i].call("move_to", target + offset)
	status_label.text = "Ordre de déplacement envoyé."
