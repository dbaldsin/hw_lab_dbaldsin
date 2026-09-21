import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useLibrary } from '../viewModels/LibraryContext';
const chartWidth = Dimensions.get('window').width - 40;
const baseConfig = { backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 0, color: () => '#2563eb', labelColor: () => '#334155', barPercentage: 0.62, propsForBackgroundLines: { stroke: '#e2e8f0' } };
export default function ChartsView() {
  const { getBooksFor, getFemaleAuthoredBooks, getMaleAuthoredBooks } = useLibrary();
  const genderData = { labels: ['Male', 'Female'], datasets: [{ data: [getMaleAuthoredBooks().length, getFemaleAuthoredBooks().length] }] };
  const authorData = { labels: ['Shakespeare', 'Tolkien', 'Austen', 'Dickens', 'Bronte'], datasets: [{ data: ['William Shakespeare', 'J.R.R. Tolkien', 'Jane Austen', 'Charles Dickens', 'Charlotte Bronte'].map((author) => getBooksFor(author).length) }] };
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.heading}>Library Analytics</Text><Text style={styles.subtitle}>A snapshot of your collection</Text><View style={styles.chartBlock}><Text style={styles.title}>Books by Author Gender</Text><BarChart data={genderData} width={chartWidth} height={250} chartConfig={baseConfig} fromZero yAxisLabel="" yAxisSuffix="" /></View><View style={styles.chartBlock}><Text style={styles.title}>Books by Popular Author</Text><BarChart data={authorData} width={chartWidth} height={275} chartConfig={{ ...baseConfig, color: () => '#15803d' }} fromZero yAxisLabel="" yAxisSuffix="" /></View></ScrollView>;
}
const styles = StyleSheet.create({ container: { padding: 20, paddingTop: 64, backgroundColor: '#fff' }, heading: { fontSize: 30, fontWeight: '700', color: '#0f172a' }, subtitle: { color: '#64748b', marginTop: 4 }, chartBlock: { marginTop: 28 }, title: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 8 } });
