def test_create_event(client, token):

    response = client.post(
        "/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Event Test",
            "description": "Desc",
            "capacity": 10,
            "start_date": "2026-01-01T10:00:00",
            "end_date": "2026-01-01T12:00:00",
            "speaker_name": "Speaker Test",
            "status": "PUBLISHED"
        }
    )

    assert response.status_code == 200

def test_create_event_invalid_capacity(client, token):
    response = client.post(
        "/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Capacidad Error",
            "description": "Desc",
            "capacity": 0,
            "start_date": "2026-01-01T10:00:00",
            "end_date": "2026-01-01T12:00:00",
            "speaker_name": "Speaker Test",
            "status": "PUBLISHED"
        }
    )
    assert response.status_code == 400
    assert "capacidad" in response.json()["detail"].lower()

def test_create_event_invalid_dates(client, token):
    response = client.post(
        "/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Fecha Error",
            "description": "Desc",
            "capacity": 10,
            "start_date": "2026-01-01T12:00:00",
            "end_date": "2026-01-01T10:00:00",
            "speaker_name": "Speaker Test",
            "status": "PUBLISHED"
        }
    )
    assert response.status_code == 400
    assert "inicio debe ser anterior" in response.json()["detail"]

def test_create_event_speaker_conflict(client, token):
    payload = {
        "name": "Evento 1",
        "description": "Desc",
        "capacity": 10,
        "start_date": "2026-02-01T10:00:00",
        "end_date": "2026-02-01T12:00:00",
        "speaker_name": "Diego Marin",
        "status": "PUBLISHED"
    }
    client.post("/events/", headers={"Authorization": f"Bearer {token}"}, json=payload)

    payload_conflict = {
        "name": "Evento 2",
        "description": "Desc",
        "capacity": 10,
        "start_date": "2026-02-01T11:00:00",
        "end_date": "2026-02-01T13:00:00",
        "speaker_name": "Diego Marin",
        "status": "PUBLISHED"
    }
    
    response = client.post(
        "/events/",
        headers={"Authorization": f"Bearer {token}"},
        json=payload_conflict
    )
    
    assert response.status_code == 400
    assert "ya tiene un compromiso" in response.json()["detail"]