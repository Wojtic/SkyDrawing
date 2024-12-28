read_files = [
    "data/M.js",
    "data/NGC.js",
    "data/IC.js",
    "data/starsSorted.js",
    "data/EQLines.js",
    "data/boundaries_coords.js",
    "data/constellations.js",
    "src/utils.js",
    "src/vector.js",
    "src/observer.js",
    "src/projections.js",
    "src/drawer.js"]

with open("combined.js", "w") as outfile:
    for f in read_files:
        with open(f, "r") as infile:
            for line in infile:
                outfile.write(line)
        outfile.write("\n")
