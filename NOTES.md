
# Decisions

First one: Use Intl.NumberFormat.

1. 

I've realized that conversion of the assets is a very important topic, the way JS handles it without the NumberFormat is very tricky and bug prone. And using Intl.NumberFormat is very convinient to use for currencies.

2.

Use dialogs for claiming. That's very important as I see it - that user can claim it on current page without getting navigated away from current page. I also decided to make claims a separated screen, as it may have more features in the future as (as I see it). It also can have more details or instructions about claiming.

3. Choosing to use virtualization better as the assets list can be very big.

# Working with AI

1. 