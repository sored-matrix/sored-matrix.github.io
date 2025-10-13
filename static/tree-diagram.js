// Tree Diagram for Dimension Relationships
// Using D3.js to visualize how different dimensions contribute to educational achievements

// Wait for DOM and D3 to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the relationships view or D3 is loaded
    if (typeof d3 === 'undefined') {
        console.log('D3.js not loaded');
        return;
    }
    
    console.log('Initializing tree diagram with D3.js v' + d3.version);
    
    // Dimension icons mapping (same as cards)
    const dimensionIcons = {
        'osiagniecia': 'bi-mortarboard-fill',
        'kadry': 'bi-person-badge-fill',
        'architektura': 'bi-building-fill',
        'zasoby': 'bi-box-seam-fill',
        'organizacja': 'bi-diagram-3-fill',
        'uczestnictwo': 'bi-people-fill',
        'komunikacja': 'bi-chat-dots-fill',
        'cyfrowa': 'bi-laptop-fill',
        'dydaktyka': 'bi-book-fill'
    };
    
    // Tree data structure
    // Root is on the right (OSIĄGNIĘCIA), children on the left (grouped by kapitały)
    const treeData = {
        name: "OSIĄGNIĘCIA\nEDUKACYJNE",
        key: "osiagniecia",
        icon: dimensionIcons.osiagniecia,
        children: [
            {
                name: "Kapitał ludzki",
                isCapital: true,
                children: [
                    {
                        name: "KADRY",
                        key: "kadry",
                        icon: dimensionIcons.kadry
                    }
                ]
            },
            {
                name: "Kapitał materialny",
                isCapital: true,
                children: [
                    {
                        name: "ARCHITEKTURA",
                        key: "architektura",
                        icon: dimensionIcons.architektura
                    },
                    {
                        name: "ZASOBY",
                        key: "zasoby",
                        icon: dimensionIcons.zasoby
                    }
                ]
            },
            {
                name: "Kapitał\norganizacyjny",
                isCapital: true,
                children: [
                    {
                        name: "ORGANIZACJA",
                        key: "organizacja",
                        icon: dimensionIcons.organizacja
                    },
                    {
                        name: "UCZESTNICTWO",
                        key: "uczestnictwo",
                        icon: dimensionIcons.uczestnictwo
                    }
                ]
            },
            {
                name: "Kapitał relacyjny",
                isCapital: true,
                children: [
                    {
                        name: "KOMUNIKACJA",
                        key: "komunikacja",
                        icon: dimensionIcons.komunikacja
                    },
                    {
                        name: "CYFROWA",
                        key: "cyfrowa",
                        icon: dimensionIcons.cyfrowa
                    }
                ]
            },
            {
                name: "Kapitał\nintelektualny",
                isCapital: true,
                children: [
                    {
                        name: "DYDAKTYKA",
                        key: "dydaktyka",
                        icon: dimensionIcons.dydaktyka
                    }
                ]
            }
        ]
    };
    
    // Initialize the diagram
    function initTreeDiagram() {
        const container = d3.select("#tree-diagram");
        
        if (container.empty()) {
            console.log('Tree diagram container not found');
            return;
        }
        
        // Clear any existing content
        container.html("");
        
        // Get container dimensions
        const containerNode = container.node();
        const width = containerNode.clientWidth || 1200;
        const height = 900;
        
        // Create SVG
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; display: block;");
        
        // Create a group for the tree
        const g = svg.append("g")
            .attr("transform", `translate(${width - 150},${height / 2})`);
        
        // Create tree layout (horizontal, right-to-left)
        const tree = d3.tree()
            .size([height - 150, width - 300])
            .separation((a, b) => (a.parent == b.parent ? 1 : 1.2));
        
        // Create hierarchy
        const root = d3.hierarchy(treeData);
        
        // Generate tree
        tree(root);
        
        // Draw links
        g.selectAll(".link")
            .data(root.links())
            .join("path")
            .attr("class", "tree-link")
            .attr("d", d3.linkHorizontal()
                .x(d => -d.y)
                .y(d => d.x)
            )
            .attr("fill", "none")
            .attr("stroke", d => {
                // Different colors for capital vs dimension links
                if (d.target.data.isCapital) {
                    return "#6a11cb";
                } else {
                    return "#2575fc";
                }
            })
            .attr("stroke-width", d => d.target.data.isCapital ? 3 : 2)
            .attr("stroke-opacity", 0.6);
        
        // Draw nodes
        const node = g.selectAll(".tree-node")
            .data(root.descendants())
            .join("g")
            .attr("class", d => `tree-node ${d.data.isCapital ? 'capital-node' : 'dimension-node'}`)
            .attr("transform", d => `translate(${-d.y},${d.x})`);
        
        // Add rectangles for dimensions and capitals
        node.filter(d => !d.data.isCapital || d.depth === 1)
            .append("rect")
            .attr("width", d => d.data.isCapital ? 140 : 120)
            .attr("height", d => d.data.isCapital ? 50 : 80)
            .attr("x", d => d.data.isCapital ? -70 : -60)
            .attr("y", d => d.data.isCapital ? -25 : -40)
            .attr("rx", 8)
            .attr("fill", d => {
                if (d.depth === 0) return "url(#gradient1)"; // Root
                if (d.data.isCapital) return "#f8f9fa"; // Capitals
                return "url(#gradient2)"; // Dimensions
            })
            .attr("stroke", d => d.data.isCapital ? "#6a11cb" : "#2575fc")
            .attr("stroke-width", d => d.depth === 0 ? 3 : 2);
        
        // Add gradients
        const defs = svg.append("defs");
        
        const gradient1 = defs.append("linearGradient")
            .attr("id", "gradient1")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");
        gradient1.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#6a11cb");
        gradient1.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#2575fc");
        
        const gradient2 = defs.append("linearGradient")
            .attr("id", "gradient2")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");
        gradient2.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#2575fc")
            .attr("stop-opacity", "0.8");
        gradient2.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#6a11cb")
            .attr("stop-opacity", "0.8");
        
        // Add icons for dimensions (using foreign object for HTML)
        node.filter(d => !d.data.isCapital && d.data.icon)
            .append("foreignObject")
            .attr("width", 40)
            .attr("height", 40)
            .attr("x", -20)
            .attr("y", -35)
            .append("xhtml:div")
            .attr("class", "tree-icon-container")
            .html(d => `<i class="bi ${d.data.icon} tree-icon"></i>`);
        
        // Add text labels
        node.filter(d => !d.data.isCapital || d.depth === 1)
            .append("text")
            .attr("dy", d => d.data.icon ? 15 : 5)
            .attr("text-anchor", "middle")
            .attr("fill", d => d.depth === 0 ? "white" : (d.data.isCapital ? "#6a11cb" : "#2575fc"))
            .attr("font-weight", d => (d.depth === 0 || d.data.isCapital) ? "700" : "600")
            .attr("font-size", d => {
                if (d.depth === 0) return "14px";
                if (d.data.isCapital) return "12px";
                return "11px";
            })
            .selectAll("tspan")
            .data(d => d.data.name.split('\n'))
            .join("tspan")
            .attr("x", 0)
            .attr("dy", (d, i) => i ? "1.1em" : 0)
            .text(d => d);
        
        console.log('Tree diagram rendered successfully');
    }
    
    // Initialize when relationships view is shown
    const relationshipsView = document.getElementById('relationships-view');
    if (relationshipsView) {
        // Use MutationObserver to detect when view becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (relationshipsView.classList.contains('active')) {
                        // Small delay to ensure container has dimensions
                        setTimeout(initTreeDiagram, 100);
                    }
                }
            });
        });
        
        observer.observe(relationshipsView, { attributes: true });
        
        // Also initialize if already active
        if (relationshipsView.classList.contains('active')) {
            setTimeout(initTreeDiagram, 100);
        }
    }
});

