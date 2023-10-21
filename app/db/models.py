import sqlalchemy

metadata = sqlalchemy.MetaData()

events_table = sqlalchemy.Table(
    "events",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("event_type", sqlalchemy.String(255)),
    sqlalchemy.Column("event_name", sqlalchemy.String(255)),
    sqlalchemy.Column("event_description", sqlalchemy.String(1000)),
    sqlalchemy.Column("location", sqlalchemy.String(255)),  # Missing parenthesis was added here
    sqlalchemy.Column("start_date", sqlalchemy.Date),
    sqlalchemy.Column("end_date", sqlalchemy.Date)
)
