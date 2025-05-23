import { StyleSheet } from 'react-native';

const CIRCLE_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#009DDC',
    paddingVertical: 30,
    paddingTop: Platform.OS === 'ios' ? 60 : 70
  },
  map: {
    width: 520,
    height: 400,
    resizeMode: 'contain',
    marginTop: 10,
  },
  flagTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  flagTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  flagRightMid: {
    position: 'absolute',
    right: 20,
    top: 120,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  flagLeftMid: {
    position: 'absolute',
    left: 20,
    top: 120,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  flagCenterTop: {
    position: 'absolute',
    top: 70,
    left: '45%',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  characterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  characterWithBubble: {
    alignItems: 'center',
  },
  character: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  bubble: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  holaContainer: {
    position: 'absolute',
    top: 170,
    left: '44%',
    alignItems: 'center',
  },
  emoji: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  holaText: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: 14,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#ffffffcc',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;
