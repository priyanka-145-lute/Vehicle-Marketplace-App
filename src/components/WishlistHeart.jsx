import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useWishlist} from '../context/WishlistContext';

const WishlistHeart = ({item, vehicleType, style, size = 18, color = '#444'}) => {
  const {isWishlisted, toggleWishlist} = useWishlist();
  const selected = isWishlisted(item, vehicleType);
  return (
    <TouchableOpacity
      style={style}
      accessibilityRole="button"
      accessibilityLabel={selected ? 'Remove from wishlist' : 'Add to wishlist'}
      accessibilityState={{selected}}
      onPress={event => {
        event.stopPropagation();
        toggleWishlist(item, vehicleType);
      }}>
      <Icon name={selected ? 'heart' : 'heart-outline'} size={size} color={selected ? '#ef4444' : color} />
    </TouchableOpacity>
  );
};

export default WishlistHeart;
