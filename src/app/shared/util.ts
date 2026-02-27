import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertService } from '../services/alert.service';

export async function downloadPost(post: any, event: Event) {

    event.stopPropagation();

    const element = document.getElementById(`post-${post.journalId}`);
    if (!element) return;

    // 🔥 Find engagement bar inside this post
    const engagementBar = element.querySelector('.engagement-bar') as HTMLElement;

    // Temporarily hide it
    if (engagementBar) {
        engagementBar.style.display = 'none';
    }

    try {

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

    } finally {

        // 🔥 Always restore engagement bar
        if (engagementBar) {
            engagementBar.style.display = '';
        }
    }
}

export function getMediaUrl(path: string, baseMediaUrl: string): string {
    return baseMediaUrl + "/wwwroot/" + path.replace(/\\/g, '/');
}

export function getMoodEmoji(mood: string): string {
    switch (mood?.toLowerCase()) {
        case 'happy': return '😊';
        case 'sad': return '😢';
        case 'angry': return '😡';
        case 'anxious': return '😰';
        case 'excited': return '🤩';
        case 'calm': return '😌';
        default: return '🙂';
    }
}

export function sharePost(post: any, event: Event, alertService: AlertService) {
    // Prevent post card click
    event.stopPropagation();

    const postUrl = `${window.location.origin}/post/${post.journalId}`;

    if (navigator.share) {
        navigator.share({
            title: post.title,
            text: post.content?.slice(0, 100),
            url: postUrl
        }).catch(() => { });
    } else {
        navigator.clipboard.writeText(postUrl).then(() => {
            alertService.show('Link copied to clipboard!');
        });
    }
}

async function convertImageUrlToBase64(url: string): Promise<string> {

    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
        throw new Error('Failed to load image');
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}