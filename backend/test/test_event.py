def test_create_event(client, token):

    response = client.post(
        "/events/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Event Test",
            "description": "Desc",
            "capacity": 10,
            "start_date": "2026-01-01T10:00:00",
            "end_date": "2026-01-01T12:00:00"
        }
    )

    assert response.status_code == 200