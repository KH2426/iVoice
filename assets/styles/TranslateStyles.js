//File: TranslateStyles.js
import { StyleSheet, Platform } from 'react-native';

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  autoDetectSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  autoDetectText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  languageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 30,
  },
  
  languageSelector: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 8, // reduced from 12
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  languageSelectorLast: {
    marginLeft: 0,
  },
  
  sectionSubText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  picker: {
    height: 50,
    color: '#1e293b',
    fontSize: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 10,
  },
  iconAboveInput: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  translateButtonModern: {
    marginTop: 24,
    backgroundColor: '#38bdf8',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    transitionDuration: '150ms',
  },
  translateButtonDisabled: {
    backgroundColor: '#bae6fd',
  },
  translateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  outputSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  outputTextAreaContainer: {
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  outputTextArea: {
    fontSize: 16,
    color: '#334155',
  },
  contextSection: {
    marginTop: 30,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  contextInfoBox: {
    marginTop: 12,
  },
  contextInfoText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginBottom: 4,
  },
  topHeader: {
    marginBottom: 16,
    paddingTop: 12,
    paddingBottom: 6,
    alignItems: 'center',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },

  sectionHeadingContainer: {
    marginBottom: 16,
    paddingBottom: 4,
  },
  
  gradientHeading: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  gradientHeadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  
  headingUnderline: {
    marginTop: 6,
    height: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
    width: '100%',
  },
  swapButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 18,
    marginBottom: 18,
    backgroundColor: '#e0f2fe',
    padding: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  
  
});

export default appStyles;
