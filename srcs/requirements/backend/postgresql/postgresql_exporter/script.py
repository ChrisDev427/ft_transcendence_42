from io import StringIO

# Remplacez cette chaîne par vos propres colonnes et descriptions
x = """datname\ttext\tName of this database
size\tbigint\tSize of the database in bytes
"""

print("Generated Go Code for Custom Metrics:\n")

for l in StringIO(x):
    if not l.strip() or '\t' not in l:
        continue
    column, ctype, description = l.split('\t')
    print(f"""'{column.strip()}': {{
    MetricType: prometheus.GaugeValue,
    Help: "{description.strip()}",
}}, """)
