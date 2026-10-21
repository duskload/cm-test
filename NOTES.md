
# Decisions

First one: Use Intl.NumberFormat.

I've realized that conversion of the assets is a very important topic, the way JS handles it without the NumberFormat is very tricky and bug prone. And using Intl.NumberFormat is