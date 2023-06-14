import { StyleSheet } from "react-native";

const homeScreenStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
  foodCategoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  foodCategoryItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  foodCategoryName: {
    color: 'black',
    marginTop: 8,
  },
});

export default homeScreenStyles;