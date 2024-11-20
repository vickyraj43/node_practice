async function createPost() {
    const postType = document.getElementById('postType').value;
    const content = document.getElementById('postType').value;
    
    try {
        const response = await fetch('/user/YOUR_USER_ID/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postType, content })
        });

        const data = await response.json();
        renderTemplate(data.template, data.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderTemplate(template, content) {
    const preview = document.getElementById('templatePreview');
    preview.className = `template-preview ${template.layout}`;
    preview.style.backgroundColor = template.backgroundColor;
    preview.style.fontFamily = template.fontFamily;
    
    // Split content into pages if needed
    const words = content.split(' ');
    const wordsPerPage = 500; // Adjust as needed
    let pages = [];
    
    for(let i = 0; i < words.length; i += wordsPerPage) {
        pages.push(words.slice(i, i + wordsPerPage).join(' '));
    }
    
    preview.innerHTML = pages.map(page => `
        <div class="page">
            ${template.codeHighlighting ? '<pre><code>' : ''}
            ${page}
            ${template.codeHighlighting ? '</code></pre>' : ''}
        </div>
    `).join('<hr>');
}

async function downloadAsPDF() {
    const element = document.getElementById('templatePreview');
    const opt = {
        margin: 1,
        filename: 'my-post.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

async function downloadAsPNG() {
    const element = document.getElementById('templatePreview');
    
    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-post.png';
        link.href = canvas.toDataURL();
        link.click();
    });
} 