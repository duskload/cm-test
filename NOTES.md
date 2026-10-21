# Decisions

First one: Use Intl.NumberFormat.

1.

I've realized that conversion of the assets is a very important topic, the way JS handles it without the NumberFormat is very tricky and bug prone. And using Intl.NumberFormat is very convinient to use for currencies.

2.

Use dialogs for claiming. That's very important as I see it - that user can claim it on current page without getting navigated away from current page. I also decided to make claims a separated screen, as it may have more features in the future as (as I see it). It also can have more details or instructions about claiming.

3. Choosing to use virtualization better as the assets list can be very big.

# Working with AI

> a prompt that did not get you what you wanted, and how you changed it

I said to use Intl.NumberFormat, but there was places where AI haven't done that. (#106 in Prompts.md).

> a time AI output was wrong or risky, and how you found out
> Same as above, Intl.NumberFormat. Pure js formatting can cause user to loose assets. Also, I've asked to format more decimal numbers for BTC because it's important for this asset where even tiny bits of it are very expensive. (#116 in Prompts.md)

> a time you disagreed with the AI or rejected a suggestion, and why
> When choosing the way we would display the claiming process. I just think that the one I choose is more intuitive.
