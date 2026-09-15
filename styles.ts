import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#F5F8FC',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E1EE',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    maxWidth: 420,
    minHeight: 210,
    padding: 28,
    shadowColor: '#1A365D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    width: '100%',
  },
  cardText: {
    color: '#1A365D',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 31,
    textAlign: 'center',
  },
  hint: {
    color: '#627D98',
    fontSize: 14,
    marginTop: 20,
  },
});
