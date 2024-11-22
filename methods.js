// Set up SVG canvas dimensions
const width = 800;
const height = 400;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Function to get user inputs
function getUserInputs() {
    const mass1 = {
        mass: parseFloat(document.getElementById('mass1').value),
        x: parseFloat(document.getElementById('mass1X').value),
        y: parseFloat(document.getElementById('mass1Y').value),
        vx: parseFloat(document.getElementById('mass1VX').value),
        vy: parseFloat(document.getElementById('mass1VY').value),
        radius: 10,
        color: 'blue'
    };
    const mass2 = {
        mass: parseFloat(document.getElementById('mass2').value),
        x: parseFloat(document.getElementById('mass2X').value),
        y: parseFloat(document.getElementById('mass2Y').value),
        vx: parseFloat(document.getElementById('mass2VX').value),
        vy: parseFloat(document.getElementById('mass2VY').value),
        radius: 10,
        color: 'blue'
    };
    const spring = {
        k: parseFloat(document.getElementById('springK').value),
        length: parseFloat(document.getElementById('springLength').value)
    };
    const damper = {
        c: parseFloat(document.getElementById('damperC').value)
    };
    const dt = parseFloat(document.getElementById('dt').value);

    return { mass1, mass2, spring, damper, dt };
}

// Euler method for numerical approximation
function update(mass1, mass2, spring, damper, dt, mass1Circle, mass2Circle, springLine) {
    console.log("Update function called");
    // Calculate spring force
    const dx = mass2.x - mass1.x;
    const dy = mass2.y - mass1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = spring.k * (distance - spring.length);
    const fx = force * (dx / distance);
    const fy = force * (dy / distance);

    // Calculate damping force
    const dvx = mass2.vx - mass1.vx;
    const dvy = mass2.vy - mass1.vy;
    const dampingForceX = damper.c * dvx;
    const dampingForceY = damper.c * dvy;

    // Update velocities
    mass1.vx += (fx - dampingForceX) * dt;
    mass1.vy += (fy - dampingForceY) * dt;
    mass2.vx -= (fx - dampingForceX) * dt;
    mass2.vy -= (fy - dampingForceY) * dt;

    // Update positions
    mass1.x += mass1.vx * dt;
    mass1.y += mass1.vy * dt;
    mass2.x += mass2.vx * dt;
    mass2.y += mass2.vy * dt;

    // Update SVG elements
    mass1Circle.attr("cx", mass1.x).attr("cy", mass1.y);
    mass2Circle.attr("cx", mass2.x).attr("cy", mass2.y);
    springLine.attr("x1", mass1.x).attr("y1", mass1.y).attr("x2", mass2.x).attr("y2", mass2.y);
}

// Define the startSimulation function
function startSimulation() {
    console.log("startSimulation function called");

    const { mass1, mass2, spring, damper, dt } = getUserInputs();

    // Create masses and spring
    const mass1Circle = svg.append("circle")
        .attr("cx", mass1.x)
        .attr("cy", mass1.y)
        .attr("r", mass1.radius)
        .attr("fill", mass1.color);

    const mass2Circle = svg.append("circle")
        .attr("cx", mass2.x)
        .attr("cy", mass2.y)
        .attr("r", mass2.radius)
        .attr("fill", mass2.color);

    const springLine = svg.append("line")
        .attr("x1", mass1.x)
        .attr("y1", mass1.y)
        .attr("x2", mass2.x)
        .attr("y2", mass2.y)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Start the simulation
    d3.interval(() => update(mass1, mass2, spring, damper, dt, mass1Circle, mass2Circle, springLine), dt * 1000);
}

// Attach the startSimulation function to the button click event
document.getElementById("startSimulation").addEventListener("click", function() {
    console.log("startSimulation clicked");
    startSimulation();
});