import { DatePipe, NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [DatePipe, NgClass],
  templateUrl: './app.html'
})
export class App {
  readonly students = signal<string[]>(sutdents);
  readonly dates = signal<string[]>(dates);
  readonly result = httpResource<{ id: string, date: string; students: string[] }[]>(() => "http://localhost:3000/attendances");
  readonly data = linkedSignal(() => this.result.value() ?? []);
  readonly totalParticipants = computed(() => {
    return this.data().reduce((total, d) => total + d.students.length, 0);
  })
  readonly courseDates = computed(() => this.dates().filter(p => new Date(p) <= new Date()).length);
  readonly totalNumberOfCoursesToBeAttended = computed(() => this.courseDates() * this.students().length);

  toggleCheckboxMark(date: string, student: string) {
    const dateEntry = this.data().find(d => d.date === date);
    return dateEntry ? dateEntry.students.includes(student) : false;
  }

  async toggleCheckbox(date: string, student: string) {
    const currentData = this.data();
    const dateEntry = currentData.find(d => d.date === date);

    if (dateEntry) {
      const updatedStudents = dateEntry.students.includes(student)
        ? dateEntry.students.filter(s => s !== student) // çıkar
        : [...dateEntry.students, student];             // ekle

      if (updatedStudents.length === 0) {
        // Eğer tüm öğrenciler silindiyse, kaydı tamamen sil
        await fetch(`http://localhost:3000/attendances/${dateEntry.id}`, {
          method: 'DELETE'
        });
      } else {
        // Güncelleme (PATCH)
        await fetch(`http://localhost:3000/attendances/${dateEntry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: updatedStudents })
        });
      }
    } else {
      // Yeni tarih kaydı oluştur
      await fetch(`http://localhost:3000/attendances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, students: [student] })
      });
    }

    this.result.reload();
  }

  calculateDateTotal(date: string) {
    const data = this.data().find(i => i.date === date);
    if (!data) return 0;

    return data.students.length;
  }

  calculateTotalByStudent(student: string): number {
    return this.data().reduce((total, d) => {
      return total + (d.students.includes(student) ? 1 : 0);
    }, 0);
  }
}

export const sutdents = [
  'Afranur Murat',
  'Amil Mamadov',
  'Baran Daşdemir',
  'Berkan Ylds',
  'Can Deniz',
  'Dilara Kertmen',
  'Ertürk Bektaş',
  'Emin Kutlu',
  'Emirhan Hüseyin Emek',
  'Emrah Semiz',
  'Emre Esen',
  'Emre Kaya',
  'Erkan Öksüz',
  'Fatma Oldun',
  'Furkan Devren',
  'Furkan Taşdelen',
  'Gülşen Ağan',
  'Gülşen Hepsarılar',
  'Gürkan Özdemir',
  'Kadircan Gündoğdu',
  'Mehmet Ali Sönmez',
  'Mert Ali Alkan',
  'Mervenur Yanık',
  'Meyik Ocak',
  'Muhammed Emre Nuroğlu',
  'Müstafa Tüysüz',
  'Nazlı Şahin',
  'Nur Çilek Küçükyıldırım',
  'Ozan Kömcü',
  'Ömer Özkan',
  'Ömer Yılmaz',
  'Öykü Egem Baysal',
  'Sedat Altun',
  'Sedat Yıldız',
  'Selçuk Ergül',
  'Serhat İsozu',
  'Serkan Özdemir',
  'Suavi Çilo',
  'Umutcan Recep Topcuoğlu',
  'Yusuf Uyur',
  'Yusuf İkri',
  'Yusuf Keleş',
  'Zekeriya Bozkurt'
]

export const dates = [
  '2025-07-26',
  '2025-07-29',
  '2025-07-31',
  '2025-08-02',
  '2025-08-05',
  '2025-08-07',
  '2025-08-09',
  '2025-08-12',
  '2025-08-14',
  '2025-08-16',
  '2025-08-19',
  '2025-08-21',
  '2025-08-23',
  '2025-08-26',
  '2025-08-28',
  '2025-08-31',
]
